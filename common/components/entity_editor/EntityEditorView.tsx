/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ApiService } from '../../ApiService';

interface EntityEditorViewProps {
    id: number;
	service: ApiService;
	dimension: string;
	entityExists: boolean;
}

var RecordsTab = require('./records');
var LinksTab = require('./links');
var RelationshipsTab = require('./relationships');

export const EntityEditorView = (props : EntityEditorViewProps) => (
	<span id="person-editor-container" className="wrapper flex-full">	

	{props.entityExists ? (
		<div className="alert alert-danger" role="alert"><i className="fa fa-exclamation-triangle"></i> Warning - this person is linked to another person</div>
	) : null}

	<div className="app-container">
		<div className="flex-full">
			<div className="side-panel">
				<h4>Editing {props.name} ({props.id}){props.dirty ? "*" : null}</h4> 
			<ul className="nav nav-pills nav-stacked">
				<li className={this.props.tab === 0 ? 'active' : null}><a href="#records" onClick={() => this.props.setTab(0)}>Records</a></li>
				<li className={this.props.tab === 1 ? 'active' : null}><a href="#links" onClick={() => this.props.setTab(1)}>Links</a></li>
				<li className={this.props.tab === 2 ? 'active' : null}><a href="#relationships" onClick={() => this.props.setTab(2)}>Relationships</a></li>
			</ul>
			</div>
			<div className="main-panel">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							{((tab) => {
								switch(tab) {
									case 0:
										return (<RecordsTab id={props.id} service={this.props.service} />);
									case 1:
										return (<LinksTab id={props.id} service={this.props.service} />);
									case 2:
										return (<RelationshipsTab id={props.id} service={this.props.service} />);
									default:
										console.error("INVALID TAB ID");
								}
							})(this.props.tab)}
						</div>
					</div>
				</div>					
			</div>
		</div>
	</div>
	</span>
);