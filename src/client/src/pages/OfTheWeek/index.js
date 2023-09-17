import { useEffect, useCallback } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import parser from 'html-react-parser';

import get from 'lodash/get';

import angry from '../../styles/images/angry.png';
import money from '../../styles/images/smile-sweat.png';

import PageContainer from '../PageContainer';

import { loadArticles } from '../../actions';

const styles = {
  titleContainer: {
    margin: '0 12px 12px 12px',
    paddingTop: '12px'
  },
  title: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '17px',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  root: {
    marginTop: '12px',
    backgroundColor: '#ffffff'
  },
  container: {
    padding: '12px'
  },
  contentTitle: {
    color: '#767676',
    fontSize: '0.875rem'
  },
  content: {
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex'
  }
};

const OfTheWeek = (props) => {
  const handleLoadArticles = useCallback(() => {
    props.loadArticles()
  },[props]);

  useEffect(() => {
      ReactGA.ga('send', 'pageview', '/oftheweek');
      window.scrollTo(0, 0);
      handleLoadArticles();
  });
  
  const { articles } = props;

  return (
    <div>
      <PageContainer>
        <div style={{textAlign: 'left', lineHeight: '1.5', letterSpacing: '0.01071em', color: 'rgba(0, 0, 0, 0.87)'}}>
          <div style={styles.titleContainer}>
            <div component="h3" style={styles.title}>
              #$%@ of the Week
            </div>
            <div style={styles.contentTitle}>
              That Might Help You With Picks And In Life
            </div>
          </div>
          {
            articles.map((article,index)=>(
              <div key={index} style={styles.root}>
                <div style={styles.container}>
                  <div style={styles.contentTitle}>
                    {article.title}
                  </div>
                  <br/>
                  <div style={styles.content}>
                    <div style={{margin:'auto 0'}}>{parser(article.content)}</div>
                    {!article.lockOfTheWeek ? null : article.correct ? <div style={{paddingLeft:'8px'}}><img style={{width:'40px'}} src={money} alt=""/></div> : <div style={{paddingLeft:'8px'}}><img style={{width:'40px'}} src={angry} alt=""/></div> }
                  </div>
                  <br/>
                  <div style={{fontSize: '0.875rem'}}>
                    - {article.author}
                  </div>
                  <Divider style={{
                    margin: '12px 0',
                    height: '10px',
                    backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)
                  }} />
                  <div style={{textAlign: 'center', fontSize: '0.875rem'}}>
                    {article.leagueName} {article.date}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
    const articleDomain = state.get('articleDomain').toJS();
    const articles = get(articleDomain, 'articles', []);
    const dataLoading = get(articleDomain, 'dataLoading', true);
    
    return { articles, dataLoading }
};

OfTheWeek.propTypes = {
    articles: PropTypes.array
};

export default connect(mapStateToProps,{loadArticles})(OfTheWeek);
