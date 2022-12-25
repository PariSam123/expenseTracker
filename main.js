
window.addEventListener('DOMContentLoaded', getAllData);
const expenseAmt = document.getElementById('expenseAmount');
const desc = document.getElementById('expenseDescription');
const category = document.getElementById('expenseCategory');
const addBtn = document
	.getElementById('addBtn')
	.addEventListener('click', submitBtn);
const expList = document.querySelector('.expList');

var editID = false;

function submitBtn(e) {
    e.preventDefault();

    const expense = {
		amount: expenseAmt.value,
		desc: desc.value,
		category: category.value,
	};
    if (editID == false) {
		axios
			.post(
				'https://crudcrud.com/api/005e08877cb44f0d97bcd28a18e0ca4f/expense-table',
				expense
			)
			.then((res) => {
				listExpense(res.data);
			})
			.catch((err) => console.log('Error during post', err));
	}
	// Edited data
    else {
		axios
			.put(
				`https://crudcrud.com/api/005e08877cb44f0d97bcd28a18e0ca4f/expense-table/${editID}`,
				expense
				// config
			)
			.then(() => {
                const parentNode = document.getElementById('expenseTable');
                const childHTML = `
                                    <tr id=${expense._id}> 
                                        <td>&#8377; ${expense.amount} </td>
                                        <td> ${expense.desc} </td>
                                        <td> ${expense.category} </td>
                                        <td> 
				                            <button onclick=editExpense('${expense._id}') class='btn btn-outline-primary'>Edit</button>
				                            <button onclick=deleteExpense('${expense._id}') class='btn btn-outline-danger'>&#10007; </button>
                                        </td>
                                    </tr>
                                `;
                parentNode.innerHTML = parentNode.innerHTML + childHTML;
				editID = false;
			})
			.catch((err) => console.log('Error during edit', err));
	}
	expenseAmt.value = '';
	desc.value = '';
	category.value = 'Fuel';
}

//listing expenses on screen
function listExpense(expense) {
    const parentNode = document.getElementById('expenseTable');
    const childHTML = `
                                    <tr id=${expense._id}> 
                                        <td>&#8377; ${expense.amount} </td>
                                        <td> ${expense.desc} </td>
                                        <td> ${expense.category} </td>
                                        <td> 
				                            <button onclick=editExpense('${expense._id}') class='btn btn-outline-primary'>Edit</button>
				                            <button onclick=deleteExpense('${expense._id}') class='btn btn-outline-danger'>&#10007; </button>
                                        </td>
                                    </tr>
                                `;
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

//edit function
async function editExpense(editId) {
	editID = editId;
	const data = await new Promise((resolve, reject) => {
		axios
			.get(
				`https://crudcrud.com/api/005e08877cb44f0d97bcd28a18e0ca4f/expense-table/${editId}`
			)
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => console.log('Error while fetching edit data:', err));
	});
	expenseAmt.value = data.amount;
	desc.value = data.desc;
	category.value = data.category;
}

// delete function
function deleteExpense(deleteId) {
	axios
		.delete(
			`https://crudcrud.com/api/005e08877cb44f0d97bcd28a18e0ca4f/expense-table/${deleteId}`
		)
		.then(() => {
			removeExpense(deleteId);
		})
		.catch((err) => console.log('Error during deletion', err));
}

function getAllData() {
	axios
		.get(
			'https://crudcrud.com/api/005e08877cb44f0d97bcd28a18e0ca4f/expense-table'
		)
		.then((res) => {
			for (let i = 0; i < res.data.length; i++) {
				listExpense(res.data[i]);
			}
		});
}

function removeExpense(expenseId){
    const parentNode = document.getElementById('expenseTable');
    const childNodeToBeDeleted = document.getElementById(expenseId);

    if(childNodeToBeDeleted) {
        parentNode.removeChild(childNodeToBeDeleted)
    }
}