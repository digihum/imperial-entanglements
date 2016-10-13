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

	dataChanged(event) {
		this.setState({record:  Object.assign({}, this.state.record, {data: event.target.value})});
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

	render() {
		const record = this.state.record;
		return (<tr className={ this.state.editing ? "editing" : null }>
			
			<td className="icons" key={`record-${record['meta:id']}-icons`}>
				{record["meta:person_id"] !== this.props.id ? (<i className="fa fa-link"></i>) : null}
				{record.__state == "added" ? (<i className="fa fa-plus"></i>) : null}
				{record.__state == "changed" && !record.editing ? (<i className="fa fa-pencil"></i>) : null}
				{record.__editing ? (<i className="fa fa-pencil-square-o"></i>) : null}
			</td>

			{!this.state.editing ? [					
			<td key={`record-${record['meta:id']}-data`}>{record.data}</td>,					
			<td key={`record-${record['meta:id']}-rating`}>
				<Rating empty="fa fa-star-o" full="fa fa-star" readonly={true} initialRate={parseInt(record["meta:score"])} />	
			</td>,					
			<td key={`record-${record['meta:id']}-source`}>					
				<a href={`/database/source/${record["meta:source_id"]}`}>
					{this.state.sourceName}
				</a>				
			</td>,					
			<td key={`record-${record['meta:id']}-buttons`}>
				<button className="btn btn-default" onClick={this.startEditing}><i className="fa fa-pencil-square-o"></i></button>
				<button className="btn btn-default" onClick={this.deleteRecord}><i className="fa fa-trash-o"></i></button>	
			</td>
			]					

			: [

			<td key={`record-${record['meta:id']}-data`}>
				<input type="text" value={record.data} onChange={this.dataChanged} className="form-control"/>
			</td>,
			
			<td key={`record-${record['meta:id']}-rating`}>
				<Rating empty="fa fa-star-o" full="fa fa-star" readonly={false} 
					initialRate={parseInt(record["meta:score"])} onChange={this.scoreChanged} />	
			</td>,			
			
			<td key={`record-${record['meta:id']}-source`}>
				<ReactSelect value={this.state.record["meta:source_id"]}
				 options={this.state.sources}
				 onChange={this.sourceChanged}/>
			</td>,

			<td key={`record-${record['meta:id']}-buttons`}>
				<button className="btn btn-default" onClick={this.confirmEditing}><i className="fa fa-check"></i></button>
				<button className="btn btn-default" onClick={this.cancelEditing}><i className="fa fa-times"></i></button>	
			</td>	
			]}
		</tr>);
	}
});
