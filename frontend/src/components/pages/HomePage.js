import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link , Router} from 'react-router';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import * as Blueprint from "@blueprintjs/core";

class CampaignsList extends Component {
	
	render() {
		const { commentCampaigns } = this.props;

		return (
			<div>
				<h2>Campaigns:</h2>

				<table className="pt-table">
					<thead>
						<tr>
							<th>Message</th>
							<th>Post</th>
						</tr>
					</thead>

					<tbody>
						{commentCampaigns.map(campaign => {
							return (
								<tr key={campaign.id}>
									<td>{campaign.messageTemplate}</td> 
									<td>{campaign.targetId}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

class HomePage extends Component {
	render() {
		const { loading, me } = this.props;

		if (loading) {
			return (
				<p>Loading...</p>
			);
		}

		const commentCampaigns = me.commentCampaigns.edges.map(campaign => campaign.node)
		const token = me.profile.fbToken;
		return (
			<div className="pt-ui-text" style={{margin: 10}}>
				<p>This is a home page.</p>
				<p><Link to="/logout">Log out</Link></p>
				<p><Link to="/compose">New Campaign</Link></p>
				<p>I have a long-lived Facebook token:</p>
				<pre>{token}</pre>
				<CampaignsList commentCampaigns={commentCampaigns} />
			</div>
		);
	}
}

HomePage.propTypes = {
};

const HomeQuery = gql`query Home {
	me {
		commentCampaigns {
			edges {
				node {
					messageTemplate
					id
					targetId
				}
			}
		}
		profile {
			fbToken
		}
	}
}`;



const HomePageWithData = graphql(HomeQuery, {
    props: ({ ownProps, data }) => {
			if (data.loading) {
				return { loading: data.loading }
	 		} else {
				 return { me: data.me }
			 }
    }
})(HomePage);

export default HomePageWithData;
