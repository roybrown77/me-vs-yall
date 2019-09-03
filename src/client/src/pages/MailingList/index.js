import React, { Component } from 'react';

import PageContainer from '../PageContainer';

class MailingList extends Component {
    render() {
        return (
            <div>
                <PageContainer>
                	<div style={{padding: '12px'}}>
                    	Please email mevsyallsports@gmail.com to be placed on mailing list.
                    </div>
                </PageContainer>
            </div>
        );
    }
}

export default MailingList;