import * as React from 'react';
import { Tab } from 'react-bootstrap';

interface Props {
  title: string;
  eventKey: number;
  className?: string;
}

export class RsTab extends React.Component<Props, {}> {
  render() {
    const { title, eventKey, className, children } = this.props;
    const tab = (
      <Tab title={title} eventKey={eventKey} className={className}>
        {children}
      </Tab>
    );
    return tab;
  }
}

export default RsTab