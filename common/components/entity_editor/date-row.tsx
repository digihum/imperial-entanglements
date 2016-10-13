import * as React from 'react';

const Rating = require('react-rating');
const ReactSelect = require('react-select');
const moment = require('moment');

const dateConverter = require('../../../common/date');
const DatePicker = require('../../date_picker');

export default React.createClass({

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

	d1Changed(val, prec) {		
		this.setState({record: Object.assign({}, this.state.record, {d1: val, prec: prec})});
	},

	d2Changed(val, prec) {
		this.setState({record:  Object.assign({}, this.state.record, {d2: val, prec2: prec})});
	},

	scoreChanged(event) {
		this.setState({record: Object.assign({}, this.state.record, {"meta:score": event.toString()})});
	},

	sourceChanged(source) {
		this.setState({
			record: Object.assign({}, this.state.record, {"meta:source_id": source.value}),
			sourceName: source.label
		});
	},

	displayDate(date, prec) {
		if (date === undefined) return "";
		var actualDate = dateConverter.decode(date);

		var displayDate = moment(actualDate[0] + " " + actualDate[1] + " " + actualDate[2], "YYYY MM DD");
		switch (prec) {
			case "0": {
				return displayDate.format("YYYY");
			}
			case "1": {
				return displayDate.format("MMMM YYYY");
			}
			case "2": {
				return displayDate.format("Do MMMM YYYY");
			}
		}
		return "Err";
	},

	render() {
		const record = this.state.record;
		if(this.state.editing) {
			return (<tr data-ng-repeat="record in records" data-ng-className="{ 'editing': record.editing }">
				<td className="icons">
				{record["meta:person_id"] !== this.props.id ? (<i className="fa fa-link"></i>) : null}
				{record.__state == "added" ? (<i className="fa fa-plus"></i>) : null}
				{record.__state == "changed" && !record.editing ? (<i className="fa fa-pencil"></i>) : null}
				{record.__editing ? (<i className="fa fa-pencil-square-o"></i>) : null}
				</td>
				
				<td>					
					<select value={record['datetype']} onChange={(event) => this.setState({record:  Object.assign({}, this.state.record, {datetype: event.target.value})})} className="form-control">
						<option value="">Please Select..</option>
						<option value="exactly">exactly</option>
						<option value="after">after</option>
						<option value="before">before</option>
						<option value="between">between</option>
					</select>
				</td>
				
				<td>
					<DatePicker onChange={this.d1Changed} value={record.d1} prec={record.prec} />
				</td>
				
				<td>
					<DatePicker onChange={this.d2Changed} value={record.d2} prec={record.prec2} />
				</td>
				
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
			return (<tr data-ng-repeat="record in records" data-ng-className="{ 'editing': record.editing }">
				<td className="icons">
				{record["meta:person_id"] !== this.props.id ? (<i className="fa fa-link"></i>) : null}
				{record.__state == "added" ? (<i className="fa fa-plus"></i>) : null}
				{record.__state == "changed" && !record.editing ? (<i className="fa fa-pencil"></i>) : null}
				{record.__editing ? (<i className="fa fa-pencil-square-o"></i>) : null}
				</td>
				
				<td>					
					{record['datetype']}
				</td>
				
				<td>					
					{this.displayDate(record['d1'], record['prec'])}
				</td>
				
				<td>					
					{this.displayDate(record['d2'], record['prec2'])}				
				</td>
				
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
