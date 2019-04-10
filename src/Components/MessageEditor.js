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
  hasWhiteboardContent: boolean,
};

type ButtonProps = {
  active?: boolean,
  brandColor: string,
  disabled?: boolean,
  children: React.Node,
  onPress?: () => mixed,
};

function Button(props: ButtonProps) {
  function renderButton() {
    return (
      <View style={{ paddingHorizontal: 5 }}>
        {props.active ? <View style={[styles.dot, { backgroundColor: props.brandColor }]} /> : null}
        {props.children}
      </View>
    );
  }

  if (props.onPress) {
    return (
      <Touchable onPress={props.onPress} disabled={props.disabled}>
        {renderButton()}
      </Touchable>
    );
  }

  return renderButton();
}

class Renderer extends React.Component<Props & CP, State> {
  state = {
    attachments: [],
    message: '',
    submiting: false,
    uploading: false,
    hasWhiteboardContent: false,
  };

  whiteboardManagerMobile = null;

  get isRecipient() {
    return this.props.activeConversationId || (this.props.draft && this.props.draft.users.length);
  }

  sendMessage(context) {
    return async () => {
      const { attachments } = this.state;

      if (this.whiteboardManagerMobile) {
        this.setState({ submiting: true });

        const response = await this.getWhiteboardImage(context);

        if (response.available !== false) {
          attachments.push(response.data);

          this.whiteboardManagerMobile.clearCanvas();
          this.whiteboardManagerMobile.clearCanvas();
          this.whiteboardManagerMobile.clearCanvas();
          this.whiteboardManagerMobile = null;
          this.setState({ hasWhiteboardContent: false });
        }
      }

      if (this.state.message || attachments.length) {
        this.setState({ submiting: true });

        this.props.sendMessage({
          body: this.state.message,
          attachments: attachments.map(attachment => attachment.id),
        });

        this.setState({ message: '', attachments: [] });
      }

      this.setState({ submiting: false });
    };
  }

  getWhiteboardImage = context => {
    return new Promise(async resolve => {
      if (this.state.hasWhiteboardContent) {
        const whiteboardImage = await new Promise(resolve => {
          this.whiteboardManagerMobile.getImageUri(resolve);
        });

        const response = await context.functions.uploadFile(whiteboardImage);

        resolve(response);
      }

      resolve({ available: this.state.hasWhiteboardContent });
    });
  };

  openAttachmentPicker(cb) {
    return async e => {
      this.setState({ uploading: true });
      const response = await cb(e);
      if (response.ok) {
        response.data.map(res => {
          if (res.ok) {
            this.setState(({ attachments }) => {
              attachments.push(res.data);
              return { attachments };
            });
          }
        });
      }

      this.setState({ uploading: false });
    };
  }

  openWhiteboardMobile(openWhiteboard) {
    return async () => {
      const whiteboard = await openWhiteboard(() => {
        whiteboard.hasContent(available => {
          this.setState({ hasWhiteboardContent: available });
        });
      });

      this.whiteboardManagerMobile = whiteboard;
    };
  }

  openWhiteboardWeb(openWhiteboard) {
    return async () => {
      const response = await openWhiteboard();

      console.log('web', response);
    };
  }

  onRemoveAttachment(attachment) {
    return () => {
      this.setState(({ attachments }) => {
        attachments.splice(attachments.findIndex(att => att.id === attachment.id), 1);
        return { attachments };
      });
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
          <Button active={this.state.attachments.length} brandColor={context.colors.brand}>
            <AttachmentIcon />
          </Button>
        </label>
      </div>
    );
  }

  renderAttachmentPickerMobile(context) {
    const AttachmentIcon = context.icons.AttachmentIcon;
    return (
      <Button
        active={this.state.attachments.length}
        brandColor={context.colors.brand}
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
    const busy = this.state.submiting || this.state.uploading;
    const disabled =
      !this.state.attachments.length && !this.state.message && !this.state.hasWhiteboardContent;
    return (
      <Touchable
        onPress={this.sendMessage(context)}
        onLayout={this.onLayout}
        disabled={busy || disabled}
      >
        <View style={styles.buttonWrapper}>
          {busy ? (
            <Loader />
          ) : (
            <Text
              style={[
                styles.button,
                { color: colors.brand },
                disabled ? styles.buttonDisabled : undefined,
              ]}
            >
              Send
            </Text>
          )}
        </View>
      </Touchable>
    );
  };

  renderAttachment(context) {
    return attachment => (
      <View key={attachment.id} style={styles.attachmentItem}>
        <Text style={[{ color: context.colors.grayText }, styles.attachmentName]}>
          {attachment.filename}
        </Text>
        <Touchable onPress={this.onRemoveAttachment(attachment)}>
          <Text style={[{ color: context.colors.grayText }, styles.attachmentButton]}>✕</Text>
        </Touchable>
      </View>
    );
  }

  renderAttachments = context => {
    return this.state.attachments.map(this.renderAttachment(context));
  };

  render() {
    return (
      <MessengerContext.Consumer>
        {context => {
          const { WhiteboardIcon } = context.icons;
          const { functions, colors } = context;

          return this.isRecipient ? (
            <View style={styles.container}>
              {this.renderAttachments(context)}
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
                          active={this.state.hasWhiteboardContent}
                          brandColor={colors.brand}
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
          ) : null;
        }}
      </MessengerContext.Consumer>
    );
  }
}

const mapState = state => ({
  draft: select.draft(state),
});

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
  buttonDisabled: {
    opacity: 0.5,
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
  attachmentItem: {
    height: 30,
    borderRadius: 3,
    width: '100%',
    paddingLeft: 10,
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#EEF1F2',
  },
  attachmentName: { fontSize: 12, lineHeight: 30, flex: 1 },
  attachmentButton: { fontSize: 20, lineHeight: 30, paddingHorizontal: 10 },
});
