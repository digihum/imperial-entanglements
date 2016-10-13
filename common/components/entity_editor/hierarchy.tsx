import * as React from 'react';

const HierarchyRow = require('./hierarchy-row');

module.exports = React.createClass({

	getInitialState() {
	    return {
	        hierarchy: {
	        	levels: []
	        }  
	    };
	},

	componentDidMount() {
	    this.props.service.getHierarchy(this.props.subtype)
	    .then((data) => {
	    	this.setState({hierarchy: data})
	    });
	},

	render() {
		const props = this.props;
		return (
			<div className="record-field-box card">
				<h5 className="header"> {props.name}
					<i className="fa fa-times delete-icon"></i>
					<i className="fa fa-plus add-icon" onClick={() => props.postAdd({ type: "string", field: props.name})}></i>
				</h5>
				<table className="table table-hover person-edit-table">
					<thead>
						<tr>
							<th className="col-md-1"></th>
							{this.state.hierarchy.levels.map((level) => (
								<th key={`${props.name}-${level}`}>{level}</th>
							))}							
							<th className="col-md-1">Score</th>
							<th className="col-md-2">Source</th>
							<th className="col-md-2">Actions</th>	
						</tr>											
					</thead>
					<tbody>
						{props.records.map((record, i) => (				
							<HierarchyRow key={`record-id-${record['meta:id']}`}
								record={record}
								id={props.id}
								name={props.name}
								hierarchy={this.state.hierarchy}
								service={props.service}
								postChange={props.postChange}
								postDelete={props.postDelete}  />
						))}
					</tbody>
				</table>		
			</div>	
		);
	}
});
