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

  componentWillUnmount() {
    localStorage.labelsDefault = false;
    localStorage.labelsLanguage = false;
    localStorage.currentLanguage = false;
  }

  private loadLabels() : void {
    const language = getPreferredUserLanguage();
    // Load messages file from /assets/i18n/messages.json
    if (!localStorage.labelsDefault) {
      fetch(`/assets/i18n/messages.json`)
        .then(response => response.json())
        .then(labelsDefault => {
          this.setState({ labelsDefault, isLoading: false });
          localStorage.labelsDefault = JSON.stringify(labelsDefault);
        })
        .catch(() => {
          const message = `Failed to load default labels. Make sure that the file /assets/i18n/messages.json exists and contains a valid JSON object.`
          this.setState({ error: message, isLoading: false });
        });
    } else {
      this.setState({ labelsDefault: JSON.parse(localStorage.labelsDefault), isLoading: false });
    }

    // Load language labels from /assets/i18n/messages_{language}.json
    if (localStorage.currentLanguage !== language || !localStorage.labelsLanguage) {
      fetch(`/assets/i18n/messages_${language}.json`)
        .then(response => response.json())
        .then(labelsLanguage => {
          this.setState({ labelsLanguage, isLoading: false });
          localStorage.labelsLanguage = JSON.stringify(labelsLanguage);
          localStorage.currentLanguage = language;
        });
      } else {
        this.setState({ labelsLanguage: JSON.parse(localStorage.labelsLanguage), isLoading: false });
      }
  }

  render() {
    const text = this.props.children;
    const language = getPreferredUserLanguage();
    if (this.state.error) {
      return React.createElement(ErrorNotification, { errorMessage: this.state.error });
    } else if (!this.state.isLoading) {
      const displayMessage = this.state.labelsLanguage[text] || this.state.labelsDefault[text] || null;
      if (displayMessage) {
        return <span>{displayMessage}</span>;
      } else {
        return <span></span>;
      }
    }
    return null;
  }
}

export default I18nComponent;