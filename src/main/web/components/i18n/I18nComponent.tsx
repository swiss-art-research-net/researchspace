import * as React from 'react';

import { Component } from 'platform/api/components';
import { getPreferredUserLanguage } from 'platform/api/services/language';
import { ErrorNotification } from 'platform/components/ui/notification';

export interface State {
  labelsDefault: {},
  labelsLanguage: {},
  isLoading: boolean,
  error?: string
}

export class I18nComponent extends Component<{}, State> {

  constructor(props: {}, context: any) {
    super(props, context);
    this.state = {
      labelsDefault: {},
      labelsLanguage: {},
      isLoading: true,
      error: undefined
    }
  }

  componentDidMount() : void {
    this.loadLabels();
  }

  private loadLabels() : void {
    const language = getPreferredUserLanguage();
    // Load messages file from http://localhost:8080/assets/i18n/messages.json
    fetch(`/assets/i18n/messages.json`)
      .then(response => response.json())
      .then(labelsLanguage => {
        this.setState({ labelsLanguage, isLoading: false });
      })
      .catch(error => {
        const message = `Failed to load default labels. Make sure that the file /assets/i18n/messages.json exists.`
        this.setState({ error: message, isLoading: false });
      });
  }
  render() {
    const text = this.props.children;
    const language = getPreferredUserLanguage();
    if (this.state.error) {
      return React.createElement(ErrorNotification, { errorMessage: this.state.error });
    } else if (!this.state.isLoading) {
      return <div>Test: {text} - {language}</div>;
    }
    return null;
  }
}

export default I18nComponent;