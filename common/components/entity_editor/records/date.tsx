import * as React from 'react';
import DateRow from './date-row';

export default (props) => (
<div className="record-field-box card">
	<h5 className="header"> {props.name}
		<i className="fa fa-times delete-icon"></i>
		<i className="fa fa-plus add-icon" onClick={() => props.postAdd({ type: "string", field: props.name})}></i>
	</h5>
	<table className="table table-hover person-edit-table">
		<thead>
			<tr>
				<th className="col-md-1"></th>
				<th className="col-md-2">Type</th>
				<th className="col-md-2">Date 1</th>
				<th className="col-md-2">Date 2</th>
				<th className="col-md-1">Score</th>
				<th className="col-md-2">Source</th>
				<th className="col-md-2">Actions</th>	
			</tr>											
		</thead>
		<tbody>
			{props.records.map((record, i) => (				
				<DateRow key={`record-id-${record['meta:id']}`}
					record={record}
					id={props.id}
					name={props.name}
					service={props.service}
					postChange={props.postChange}
					postDelete={props.postDelete}  />
			))}
		</tbody>
	</table>		
</div>	
);
