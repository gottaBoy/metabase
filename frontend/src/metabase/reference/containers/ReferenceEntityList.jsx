/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import moment from "moment";

import S from "metabase/components/List.css";
import List from "metabase/components/List.jsx";
import Icon from "metabase/components/Icon.jsx";
import Item from "metabase/components/Item.jsx";
import EmptyState from "metabase/components/EmptyState.jsx";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import {
    getSection,
    getData,
    getError,
    getLoading
} from "../selectors";

import * as metadataActions from "metabase/redux/metadata";

const mapStateToProps = (state, props) => ({
    section: getSection(state),
    entities: getData(state),
    loading: getLoading(state),
    loadingError: getError(state)
});

const mapDispatchToProps = {
    ...metadataActions
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ReferenceEntityList extends Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        entities: PropTypes.object.isRequired,
        section: PropTypes.object.isRequired,
        loading: PropTypes.bool,
        loadingError: PropTypes.object
    };

    render() {
        const {
            entities,
            style,
            section,
            loadingError,
            loading
        } = this.props;

        console.log(entities);

        const empty = {
            icon: 'mine',
            message: 'You haven\'t added any databases yet.'
        };
        return (
            <div style={style} className="full">
                <div className="wrapper wrapper--trim">
                    <div className={S.header}>
                        <div className={S.leftIcons}>
                            { section.headerIcon &&
                                <Icon
                                    className="text-brand"
                                    name={section.headerIcon}
                                    width={24}
                                    height={24}
                                />
                            }
                        </div>
                        {section.name}
                    </div>
                </div>
                <LoadingAndErrorWrapper loading={!loadingError && loading} error={loadingError}>
                { () => Object.keys(entities).length > 0 ?
                    <div className="wrapper wrapper--trim">
                        <List>
                            { Object.values(entities).map(entity =>
                                entity && entity.id && entity.name &&
                                    <li className="relative" key={entity.id}>
                                        <Item
                                            id={entity.id}
                                            name={entity.display_name || entity.name}
                                            description={section.type !== 'questions' ?
                                                entity.description :
                                                `Created ${moment(entity.created_at).fromNow()} by ${entity.creator.common_name}`
                                            }
                                            url={`${section.id}/${entity.id}`}
                                            icon="star"
                                        />
                                    </li>
                            )}
                        </List>
                    </div>
                    :
                    <div className={S.empty}>
                      <EmptyState message={empty.message} icon={empty.icon} />
                    </div>
                }
                </LoadingAndErrorWrapper>
            </div>
        )
    }
}
