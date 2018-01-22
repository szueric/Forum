﻿import * as React from 'react';
import * as Utility from '../../Utility';
import * as $ from 'jquery';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import { RouteComponent } from '../RouteComponent';
import { Replier } from './Topic-Replier';
import { ReplyContent } from './Topic-ReplyContent';
import { Award } from './Topic-Award';
import { PostManagement } from './Topic-PostManagement';
import { Judge } from './Topic-Judge';
import { ReplierSignature } from './Topic-ReplierSignature';
declare let moment: any;
interface Props{
    topicId;
    page;
    topicInfo;
    boardInfo;
    quote;
    isTrace;
    isHot;
    userId;
}
export class Reply extends React.Component<Props, { inWaiting, contents, masters }>{
    constructor(props, content) {
        super(props, content);
        this.update = this.update.bind(this);
        this.quote = this.quote.bind(this);
        this.state = {
            inWaiting: true,
            contents: [],
            masters: [],
        };
    }
    quote(content, userName, replyTime, floor, postId) {
        this.props.quote(content, userName, replyTime, floor, postId);
    }
    async update() {
        const page = this.props.page || 1;
        let realContents;
        if (this.props.isHot) {
            realContents = await Utility.getHotReplyContent(this.props.topicId);

        } else if (this.props.isTrace) {
            const data = await Utility.getUserInfo(this.props.userId);
            const userName = data.name;
            realContents = await Utility.getCurUserTopicContent(this.props.topicId, page, userName, this.props.userId);
        } else {
            realContents = await Utility.getTopicContent(this.props.topicId, page);
        }

        this.setState({ contents: realContents });
    }
    async componentDidMount() {
        const page = this.props.page || 1;
        let realContents;
        if (this.props.isHot) {
            realContents = await Utility.getHotReplyContent(this.props.topicId);
            if (!realContents) this.setState({ inWaiting: false, contents: [] });
        } else if (!this.props.isTrace) {
            realContents = await Utility.getTopicContent(this.props.topicId, page);
            if (!realContents) this.setState({ inWaiting: false, contents: [] });
        }
        const masters = this.props.boardInfo.boardMasters;
        this.setState({ inWaiting: false, contents: realContents, masters: masters });
    }
    async componentWillReceiveProps(newProps) {
        if (newProps.page !== this.props.page || newProps.topicInfo.replyCount !== this.props.topicInfo.replyCount ) {
            this.setState({ inWaiting: true });
            const page = newProps.page || 1;
            let realContents;
            if (newProps.isHot) {
                realContents = await Utility.getHotReplyContent(newProps.topicId);
                if (!realContents) this.setState({ inWaiting: false, contents: [] });
            } else if (newProps.isTrace) {
                const data = await Utility.getUserInfo(newProps.userId);
                const userName = data.name;
                realContents = await Utility.getCurUserTopicContent(newProps.topicId, page, userName, newProps.userId);
            } else {
                realContents = await Utility.getTopicContent(newProps.topicId, page);
                if (!realContents) this.setState({ inWaiting: false, contents: [] });
            }
            const masters = newProps.boardInfo.boardMasters;
            this.setState({inWaiting:false,contents: realContents,masters:masters });
        }
    }

    private generateContents(item) {
      
        let privilege = null;
        if (Utility.getLocalStorage("userInfo"))
            privilege = Utility.getLocalStorage("userInfo").privilege;
        const id = item.floor % 10;
        let likeInfo = { likeCount: item.likeCount, dislikeCount: item.dislikeCount, likeState: item.likeState };
        //判断加不加热评
        let hotReply = null;
        let awards = <Award postId={item.postId} updateTime={Date.now()} awardInfo={item.awards} />;
        if (item.awards === []) awards = null;
        if (item.floor === 1 && !this.props.isTrace) {
            hotReply = <Reply topicInfo={this.props.topicInfo} page={this.props.page} boardInfo={this.props.boardInfo} quote={this.quote} isTrace={false} isHot={true} userId={null} topicId={this.props.topicId} />;
            return <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <div className="reply" id={id.toString()} >
                    <Replier key={item.postId} topicInfo={this.props.topicInfo} userInfo={item.userInfo} traceMode={this.props.isTrace ? true : false} isHot={this.props.isHot ? true : false} />
                    <div className="column" style={{ justifyContent: "space-between", width: "55.5rem", position: "relative" }}>
                        <Judge userId={item.userId} postId={item.postId} update={this.update} topicId={item.topicId} />
                        <PostManagement topicId={item.topicId} postId={item.postId} userId={item.userId} update={this.update} privilege={privilege} boardId={this.props.boardInfo.id} floor={item.floor} />
                        <ReplyContent key={item.content} postId={item.postId} content={item.content} contentType={item.contentType} />
                        {awards}
                        <ReplierSignature userInfo={item.userInfo} quote={this.quote} boardInfo={this.props.boardInfo} postInfo={item} likeInfo={likeInfo} traceMode={this.props.isTrace ? true : false} topicInfo={this.props.topicInfo} />
                    </div>
                    <FloorSize isHot={this.props.isHot} floor={item.floor} />
                </div>
                {hotReply}
            </div>;
        } else {
            return <div className="reply" id={id.toString()} >
                <Replier key={item.postId} topicInfo={this.props.topicInfo} userInfo={item.userInfo}   traceMode={this.props.isTrace ? true : false} isHot={this.props.isHot ? true : false} />
                <div className="column" style={{ justifyContent: "space-between", width: "55.5rem", position: "relative" }}>
                    <Judge userId={item.userId} postId={item.postId} update={this.update} topicId={item.topicId} />
                    <PostManagement topicId={item.topicId} postId={item.postId} userId={item.userId} update={this.update} privilege={privilege} boardId={this.props.boardInfo.id} floor={item.floor} />
                    <ReplyContent key={item.content} postId={item.postId} content={item.content} contentType={item.contentType} />
                    {awards}
                    <ReplierSignature userInfo={item.userInfo} quote={this.quote} boardInfo={this.props.boardInfo} postInfo={item} likeInfo={likeInfo} traceMode={this.props.isTrace ? true : false} topicInfo={this.props.topicInfo} />
                </div>
                <FloorSize isHot={this.props.isHot} floor={item.floor} />
            </div>;
        }
        
    }

    componentDidUpdate() {

        if (window.location.hash && window.location.hash !== '#') {
            const hash = window.location.hash;
            const eleId = hash.split("#");
            const Id = eleId[1];
            if (document.getElementById(Id))
            document.getElementById(Id).scrollIntoView();
        }
    }
    render() {
        if (this.props.isHot && this.state.inWaiting)
            return null;
        if (!this.state.inWaiting) {
            if (!this.state.contents || !this.state.contents.length ) {
                return <div></div>;
            }
            return <div className="center" style={{ width: "71rem", marginRight:"1px" }}>
                {this.state.contents.map(this.generateContents.bind(this))}
            </div>
                ;
        }
        else
            return <i style={{marginTop:"1rem"}} className="fa fa-spinner fa-pulse fa-5x fa-fw"></i>;

    }
}

export class FloorSize extends React.Component<{isHot:boolean, floor: number }> {
    render() {
        if (!this.props.isHot) {
            if (this.props.floor > 9999)
                return <div className="reply-floor-small">{this.props.floor}</div>;
            else {
                return <div className="reply-floor">{this.props.floor}</div>;
            }
        } else {
            return <div style={{ backgroundColor: "red" }} className="reply-floor"><img style={{ width: "20px", height: "30px", paddingTop:"5px" }} src="/static/images/hot.png" /></div>;
        }
      
    }
}

 
/**
 * 文章内容
 */
export class ContentState {
    constructor(
    ) {

    }
    id: number;
    content: string;
    time: string;
    isDeleted: boolean;
    floor: number;
    isAnonymous: boolean;
    lastUpdateAuthor: string;
    lastUpdateTime: string;
    topicId: number;
    userName: string;
    sendTopicNumber: number;
    userImgUrl: string;
    signature: string;
    userId: number;
    privilege: string;
    likeNumber: number;
    dislikeNumber: number;
    postId: number;
    contentType: number;
    popularity: number;
}