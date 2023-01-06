import { Component } from "react"
import Typed from "typed.js"

export default class Typewriter extends Component {
  componentDidMount() {
    const options = {
      strings: this.props.strings,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1500,
      loop: true,
    };

    this.typed = new Typed(this.el, options);
  }

  componentWillUnmount() {
    this.typed.destroy();
  }

  render() {
    return <span ref={el => this.el = el} />
  }
}
