﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';

import { UserCenterConfigAvatar } from './UserCenterConfigAvatar';
import { UserCenterConfigSignature } from './UserCenterConfigSignature';
import { UserCenterConfigPassword } from './UsercenterConfigPassword';

export class UserCenterConfig extends React.Component {

    render() {
        return (<div className="user-center-config">
            <UserCenterConfigAvatar />
            <hr />
            <UserCenterConfigSignature />
            <hr />
            <UserCenterConfigPassword />
        </div>);
    }
}