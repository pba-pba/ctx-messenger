// @flow

import React from 'react';
import redraft from 'redraft';

import { DraftJsLink } from './DraftJsLink';
import { renderers } from './renderers';

type Props = {
  richContent: string,
  color?: string,
};

type State = {};

export class DraftJsRenderer extends React.Component<Props, State> {
  get richContent() {
    return JSON.parse(this.props.richContent);
  }

  renderContent() {
    return redraft(this.richContent, renderers(this.props.color));
  }

  renderLink() {
    const { entityMap } = this.richContent;
    const linkKey = Object.keys(entityMap).find(key => entityMap[key].type === 'LINK');

    if (!linkKey) {
      return null;
    }

    const entityMapLink = entityMap[linkKey];

    return <DraftJsLink entityMap={entityMapLink} />;
  }

  render() {
    if (!this.props.richContent) {
      return null;
    }

    return (
      <React.Fragment>
        {this.renderContent()}
        {this.renderLink()}
      </React.Fragment>
    );
  }
}
