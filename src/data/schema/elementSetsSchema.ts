/**
 * @fileOverview Element Sets Schema
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

export const elementSetsSchema = (enforceUid = false) => {

	const required = ['name'];
	if (enforceUid) {
		required.push('uid');
	}

	return {
		'title': 'Element Set Create',
		'type': 'object',
		'properties': {
			'uid': {
				'type': 'integer',
				'minimum': 0
			},
			'name': {
				'type': 'string'
			},
			'uri': {
				'type': 'string'
			},
			'description': {
				'description': 'Description of element set',
				'type': 'string'
			}
		},
		required
	};
};