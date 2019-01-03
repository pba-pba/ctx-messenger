// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { View, Text, Touchable, StyleSheet, Platform } from 'react-primitives';

import { select } from '../store';
import { sendMessage } from '../store/actions';
import { MessengerContext } from '../MessengerContext';

type Props = {};

type CP = {
  sendMessage: *,
};

type State = {
  attachments: string[],
  message: string,
  submiting: boolean,
  uploading: boolean,
};

type ButtonProps = {
  active?: boolean,
  bandColor: string,
  disabled?: boolean,
  children: React.Node,
  onPress(): mixed,
};

function Button(props: ButtonProps) {
  return (
    <Touchable onPress={props.onPress} disabled={props.disabled}>
      <View style={{ paddingHorizontal: 5 }}>
        {props.active ? <View style={[styles.dot, { backgroundColor: props.bandColor }]} /> : null}
        {props.children}
      </View>
    </Touchable>
  );
}

class Renderer extends React.Component<Props & CP, State> {
  state = {
    attachments: [],
    message: '',
    submiting: false,
    uploading: false,
  };

  whiteboardManagerMobile = null;

  get isValid() {
    return this.state.message || this.state.attachments.length;
  }

  sendMessage(context) {
    return async () => {
      const { attachments } = this.state;

      if (this.whiteboardManagerMobile) {
        this.setState({ submiting: true });

        const response = await this.getWhiteboardImage(context);

        if (response.available !== false) {
          attachments.push(response.data.id);

          this.whiteboardManagerMobile.clearCanvas();
          this.whiteboardManagerMobile.clearCanvas();
          this.whiteboardManagerMobile.clearCanvas();
          this.whiteboardManagerMobile = null;
        }
      }

      if (this.state.message || attachments.length) {
        this.setState({ submiting: true });

        this.props.sendMessage({
          body: this.state.message,
          attachments: attachments,
        });

        this.setState({ message: '', attachments: [] });
      }

      this.setState({ submiting: false });
    };
  }

  getWhiteboardImage = context => {
    return new Promise((resolve, reject) => {
      this.whiteboardManagerMobile.hasContent(async available => {
        if (available) {
          const whiteboardImage = await new Promise(resolve => {
            this.whiteboardManagerMobile.getImageUri(resolve);
          });

          const response = await context.functions.uploadFile(whiteboardImage);

          resolve(response);
        }

        resolve({ available: available });
      });
    });
  };

  openAttachmentPicker(cb) {
    return async e => {
      this.setState({ uploading: true });
      const responses = await cb(e);

      responses.map(response => {
        if (response.ok) {
          this.setState(({ attachments }) => {
            attachments.push(response.data.id);
            return { attachments };
          });
        }
      });

      this.setState({ uploading: false });
    };
  }

  openWhiteboardMobile(openWhiteboard) {
    return async () => {
      const whiteboard = await openWhiteboard();
      this.whiteboardManagerMobile = whiteboard;
    };
  }

  openWhiteboardWeb(openWhiteboard) {
    return async () => {
      const response = await openWhiteboard();

      console.log('web', response);
    };
  }

  renderAttachmentPickerWeb(context) {
    const AttachmentIcon = context.icons.AttachmentIcon;
    return (
      <div>
        <input
          multiple
          id="file-attachments"
          type="file"
          onChange={this.openAttachmentPicker(context.functions.openAttachmentPicker)}
          style={{ visibility: 'hidden', position: 'fixed', top: 0, left: 0, width: 0, height: 0 }}
        />
        <label htmlFor="file-attachments" style={{ cursor: 'pointer' }}>
          <AttachmentIcon />
        </label>
      </div>
    );
  }

  renderAttachmentPickerMobile(context) {
    const AttachmentIcon = context.icons.AttachmentIcon;
    return (
      <Button
        active={this.state.attachments.length}
        bandColor={context.colors.brand}
        onPress={this.openAttachmentPicker(context.functions.openAttachmentPicker)}
      >
        <AttachmentIcon />
      </Button>
    );
  }

  renderInput = context => {
    const { Input } = context.components;
    return (
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <Input
          onChangeText={val => this.setState({ message: val })}
          onSubmit={this.sendMessage(context)}
          value={this.state.message}
          placeholder="Write message"
          style={Platform.OS === 'web' ? styles.inputWeb : styles.inputMobile}
          onKeyDown={evt => {
            if (evt.key === 'Enter' && evt.shiftKey === false) {
              evt.preventDefault();
              this.sendMessage(context);
            }
          }}
        />
      </View>
    );
  };

  renderSubmitButton = context => {
    const { Loader } = context.components;
    const { colors } = context;
    const disabled = this.state.uploading;
    return (
      <Touchable onPress={this.sendMessage(context)} onLayout={this.onLayout} disabled={disabled}>
        <View style={styles.buttonWrapper}>
          {this.state.submiting ? (
            <Loader />
          ) : (
            <Text
              style={[
                styles.button,
                { color: colors.brand },
                disabled ? { opacity: 0.5 } : undefined,
              ]}
            >
              Send
            </Text>
          )}
        </View>
      </Touchable>
    );
  };

  render() {
    return (
      <MessengerContext.Consumer>
        {context => {
          const { WhiteboardIcon } = context.icons;
          const { functions, colors } = context;

          return (
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <View style={styles.buttons}>
                  {functions ? (
                    <React.Fragment>
                      {functions.openAttachmentPicker
                        ? Platform.OS === 'web'
                          ? this.renderAttachmentPickerWeb(context)
                          : this.renderAttachmentPickerMobile(context)
                        : null}
                      {functions.openWhiteboard ? (
                        <Button
                          active={!!this.state.whiteboard}
                          bandColor={colors.brand}
                          onPress={
                            Platform.OS === 'web'
                              ? this.openWhiteboardWeb(functions.openWhiteboard)
                              : this.openWhiteboardMobile(functions.openWhiteboard)
                          }
                        >
                          <WhiteboardIcon />
                        </Button>
                      ) : null}
                    </React.Fragment>
                  ) : null}
                  {this.renderInput(context)}
                </View>
                {this.renderSubmitButton(context)}
              </View>
            </View>
          );
        }}
      </MessengerContext.Consumer>
    );
  }
}

const mapState = state => ({});

const mapDispatch = (dispatch: Dispatch<*>, ownProps: Props) => ({
  sendMessage: (data: *) => {
    dispatch(sendMessage(data));
  },
});

export const MessageEditor = connect(
  mapState,
  mapDispatch,
)(Renderer);

const styles = StyleSheet.create({
  container: {
    padding: 6,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowColor: 'rgba(117,120,128,0.15)',
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(117,120,128,0.5)',
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 10,
    fontSize: 17,
  },
  inputMobile: {
    borderRadius: 16,
    fontSize: 14,
    color: '#455a64',
    backgroundColor: '#edf0f2',
    paddingHorizontal: 15,
    ...Platform.select({
      ios: { paddingVertical: 7 },
      android: { paddingVertical: 2 },
    }),
  },
  inputWeb: { width: '100%' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    position: 'absolute',
    top: 0,
    right: 5,
  },
});
