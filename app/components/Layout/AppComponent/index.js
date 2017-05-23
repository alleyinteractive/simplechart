import { Component } from 'react';
import * as styles from './AppComponent.css';

export default class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.parentStyles = styles;
  }
}
