﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import { UserFanInfo } from '../States/AppState';
import { RouteComponent } from './app';
import { UserCenterMyFollowingsUser } from './UserCenterMyFollowingsUser';
import { UserCenterPageCount } from './UserCenterPageCount';
import * as Utility from '../Utility';

//用户中心我的关注组件
export class UserCenterMyFollowings extends RouteComponent<null, UserCenterMyFollowingsState, {page}> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            userFollowings: [],
            totalPage: 2
        };
    }

    async componentDidMount() {

        const token = Utility.getLocalStorage("accessToken");
        const page = this.match.params.page || 1;
        let url = `http://apitest.niconi.cc/user/follow/follower?from=${(page - 1) * 10}&size=10`;

        let res = await fetch(url, {
            headers: {
                'Authorization': token
            }
        });

        let data = await res.json();


        //没有关注

        if (!data || !data.length) {
            return false;
        }

        let fans: UserFanInfo[] = [];
        let userFanInfo = new UserFanInfo();
        let i = data.length, data2;

        while (i--) {
            let userid = data[i];

            url = `http://apitest.niconi.cc/user/${userid}`;
            res = await fetch(url);
            data2 = await res.json();

            userFanInfo.name = data2.name;
            userFanInfo.avatarImgURL = data2.portraitUrl;
            userFanInfo.posts = data2.postCount;
            userFanInfo.id = userid;

            url = `http://apitest.niconi.cc/user/follow/fancount?userid=${userid}`;
            res = await fetch(url);
            data2 = await res.json();

            userFanInfo.fans = data2;

            fans.push(userFanInfo);
        }


        const userid = Utility.getLocalStorage('userInfo').id;

        url = `http://apitest.niconi.cc/user/follow/fancount?userid=${userid}`
        res = await fetch(url);
        data2 = await res.json();

        this.setState({
            userFollowings: fans,
            totalPage: Math.floor((data2 / 10)) + 1
        });
    }

    render() {
        if (this.state.userFollowings.length === 0) {
            return (
                <div className="user-center-myfollowings">
                    没有关注
                </div>
                );
        }

        //state转换为JSX
        const userFollowings = this.state.userFollowings.map((item) => (<UserCenterMyFollowingsUser userFanInfo={item} />));
        //添加分隔线
        for (let i = 1; i < userFollowings.length; i += 2) {
            userFollowings.splice(i, 0, <hr />);
        }
        const page = this.match.params.page || 1;

        return (<div className="user-center-myfollowings">
            {userFollowings}
            <UserCenterPageCount currentPage={page} totalPage={this.state.totalPage} href="/usercenter/myfollowings/" />
        </div>);
    }
}

interface UserCenterMyFollowingsState {
    userFollowings: UserFanInfo[];
    totalPage: number;
}
