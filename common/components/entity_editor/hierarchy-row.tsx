import * as React from 'react';

const Rating = require('react-rating');
const ReactSelect = require('react-select');

module.exports = React.createClass({

	getInitialState() {
	    return {
	        editing: false,
	        record: this.props.record,
	        state: "none",
	        sourceName: "Loading..",
	        sources: []
	    };
	},

	componentDidMount() {
		this.props.service.getSource(this.state.record["meta:source_id"])
		.then((data) => {
			this.setState({sourceName: data['pretty_name']});
		});

		this.props.service.getSources()
		.then((data) => {
			this.setState({sources: data.map((source) => {
				return {
					label: source["pretty_name"], 
					value: source["id"]
				}
			})});
		});
	},

	startEditing() {
		this.setState({editing: true});
	},

	deleteRecord() {
		this.props.postDelete(this.state.record);
	},

	cancelEditing() {
		this.setState({editing: false, record: this.props.record});
	},

	confirmEditing() {
		this.props.postChange(this.state.record)
		.then(() => {
			this.setState({editing: false});
		})		
	},

	dataChanged(event, i) {
		let updatedRecord = Object.assign({}, this.state.record);
		updatedRecord[`data:${i}`] = event.value;
		for(let j = i+1; j < this.props.hierarchy.maxDepth; j++) {
			delete updatedRecord[`data:${j}`];
		}
		this.setState({record: updatedRecord});
	},

	scoreChanged(event) {
		this.setState({record:  Object.assign({}, this.state.record, {"meta:score": event.toString()})});
	},

	sourceChanged(source) {
		this.setState({
			record:  Object.assign({}, this.state.record, {"meta:source_id": source.value}),
			sourceName: source.label
		});
	},

	getHierarchyOptions(record, level) {
		
		let hierarchyLevel = this.props.hierarchy.data.children;

		for(let i=0; i<level; i++) {
			hierarchyLevel = hierarchyLevel[record["data:" + i]].children;
		}
		
		var returnValues = [];
		
		if(_.isArray(hierarchyLevel)) {
			returnValues = hierarchyLevel;
		} else {
			returnValues = _.keys(hierarchyLevel);
		}

		return _.filter(returnValues, function (item) { return item[0] !== "#"; }).map((x) => { return {label: x, value: x}});
	},

	render() {
		const record = this.state.record;

		if(this.state.editing) {
			return (
			<tr data-ng-repeat="record in records" data-ng-className="{ 'editing': record.editing }">
				<td className="icons">
				{record["meta:person_id"] !== this.props.id ? (<i className="fa fa-link"></i>) : null}
				{record.__state == "added" ? (<i className="fa fa-plus"></i>) : null}
				{record.__state == "changed" && !record.editing ? (<i className="fa fa-pencil"></i>) : null}
				{record.__editing ? (<i className="fa fa-pencil-square-o"></i>) : null}					
				</td>	



				{this.props.hierarchy.levels.map((level, i) => i == 0 || this.state.record['data:' + (i-1)] !== undefined ? (					
				<td key={`${this.props.name}-${level}-${i}-edit`}>
					<i className="fa fa-plus"></i>
					<ReactSelect value={this.state.record['data:' + i]}
						options={this.getHierarchyOptions(record, i)}
						onChange={(event) => this.dataChanged(event, i)}
						allowCreate={true} />									
				</td>
				) : <td key={`${this.props.name}-${level}-${i}-edit`}></td>)}
				
				<td>
					<Rating empty="fa fa-star-o" full="fa fa-star" readonly={false} 
						initialRate={parseInt(record["meta:score"])} onChange={this.scoreChanged} />
				</td>
				
				<td>
					<ReactSelect value={this.state.record["meta:source_id"]}
						options={this.state.sources}
						onChange={this.sourceChanged}/>
				</td>
					
				<td>
					<button className="btn btn-default" onClick={this.confirmEditing}><i className="fa fa-check"></i></button>
					<button className="btn btn-default" onClick={this.cancelEditing}><i className="fa fa-times"></i></button>	
				</td>								
			</tr>);

		} else {
			return (
			<tr data-ng-repeat="record in records" data-ng-className="{ 'editing': record.editing }">
				<td className="icons">
				{record["meta:person_id"] !== this.props.id ? (<i className="fa fa-link"></i>) : null}
				{record.__state == "added" ? (<i className="fa fa-plus"></i>) : null}
				{record.__state == "changed" && !record.editing ? (<i className="fa fa-pencil"></i>) : null}
				{record.__editing ? (<i className="fa fa-pencil-square-o"></i>) : null}				
				</td>				
		
				{this.props.hierarchy.levels.map((level, i) => (
				<td key={`${this.props.name}-${level}-${i}`} data-ng-repeat="i in vm.getNumber(vm.getHierarchy(name).maxDepth)">
					{record['data:' + i]}										
				</td>
				))}		
				
				<td>
					<Rating empty="fa fa-star-o" full="fa fa-star" readonly={true} initialRate={parseInt(record["meta:score"])} />	
				</td>		
				
				<td>
					<a href={`/database/source/${record["meta:source_id"]}`}>
						{this.state.sourceName}
					</a>		
				</td>

				<td>
					<button className="btn btn-default" onClick={this.startEditing}><i className="fa fa-pencil-square-o"></i></button>
					<button className="btn btn-default" onClick={this.deleteRecord}><i className="fa fa-trash-o"></i></button>	
				</td>
				
			
			</tr>);
		}
	}
});
