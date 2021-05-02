import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link , Router} from 'react-router';
import classNames from 'classnames';

class AuthContainer extends Component {
    render() {
        const { children, location: { pathname } } = this.props;

        const page = pathname.replace('/','');

        return (
            <div className={classNames("page auth", page)}>
                {children}
            </div>
        );
    }
}

AuthContainer.propTypes = {
};

export default AuthContainer;
