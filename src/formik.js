import React, { useEffect, useState } from "react";
import { Formik } from 'formik';
import axios from "axios";
import './formik.css';



function FormikComponent() {

    let initialValue = {
        name: '',
        price: '',
        quantity: '',

    }

    const [id, setId] = useState('');
    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        quantity: ''
    })
    const [submit, setSubmit] = useState('')


    const [value, setValue] = useState({
        user: ['']
    })

    const validate = (FormData) => {

        let errors = {};
        if (FormData.name === '') errors.name = "ProductName is required";
        if (FormData.price === '') errors.price = "Price is required";
        if (FormData.quantity === '') errors.quantity = "Quantity is required";
        return errors;
    }

    const handleSubmit = async (formData,{resetForm}) => {
 
        if (formData.name != '' && formData.price != '' && formData.quantity != '') {
            console.log(id);

            // Update
            if (id) {
                var response = await axios.put(
                    `https://622c4098087e0e041e06abea.mockapi.io/product/${id}`,
                    {
                        name: formData.name,
                        price: formData.price,
                        quantity: formData.quantity
                    }
                );
                let index = value.user.findIndex((row) => row.id === id);
                let user = [...value.user];
                user[index] = response.data;
                setValue({ user });
                formData.name = '';
                formData.price = '';
                formData.quantity = ''
                setId('');
                await setFormValues({});
                resetForm();
            }
            // CREATE
            else {
                var response = await axios.post(
                    'https://622c4098087e0e041e06abea.mockapi.io/product',
                    {
                        name: formData.name,
                        price: formData.price, //
                        quantity: formData.quantity
                    }
                );
                let user = [...value.user];
                user.push(response.data);
                setValue({ user });
                formData.name = '';
                formData.price = '';
                formData.quantity = '';
                await setFormValues({});
                resetForm();
            }
              
        }
    }

    const deleteData = async (id) => {
        let response = await axios.delete(
            `https://622c4098087e0e041e06abea.mockapi.io/product/${id}`
        )
        let user = value.user.filter((row) => row.id != id);
        setValue({ user })
    }

    const handleEdit = (id) => {

        let valueEdit = value.user.filter((row) => row.id === id)[0];
        // console.log(valueEdit.name);
        setFormValues({
            name: valueEdit.name,
            price: valueEdit.price,
            quantity: valueEdit.quantity
        })
        setId(valueEdit.id);

    }
    useEffect(async () => {
        var response = await axios.get(
            'https://622c4098087e0e041e06abea.mockapi.io/product'
        );
        await setValue({ user: response.data })
        // console.log(value)
    }, [])

    return (
        <>
            <div style={{ padding: '15px', margin: '15px' }}>
                <div style={{ border: 'solid 1px black', width: '49%', borderRadius: '5px', padding: '10px', backgroundColor: "lightcyan" }}>
                    <h3> Formik component Product Creation (CRUD)</h3>
                    <Formik
                        initialValues={formValues || initialValue}
                        validate={(FormData) => validate(FormData)}
                        onSubmit={(FormData, {resetForm}) => handleSubmit(FormData,{resetForm})}
                        enableReinitialize  // Edit Values in Formik
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            resetForm // Reset form
                            /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label> ProductName: </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    /> <br />
                                    <span style={{ color: 'red' }}>{touched.name && errors.name}</span>

                                </div>
                                <br />
                                <div>
                                    <label> Price </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={values.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    /> <br />
                                    <span style={{ color: 'red' }}>{touched.price && errors.price}</span>
                                </div>
                                <br />
                                <div>
                                    <label> Quantity </label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={values.quantity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <br />
                                    <span style={{ color: 'red' }}>{touched.quantity && errors.quantity}</span>
                                </div>
                                <br />

                                <div>
                                    <button type="submit" disabled={isSubmitting} >
                                        Submit
                                    </button>
                                    &nbsp; &nbsp;
                                    <button type="reset" onClick={resetForm}>Reset</button>
                                &nbsp;&nbsp;
                                </div>
                                <span style={{ color: 'red' }}>{submit}</span>
                            </form>
                        )}
                    </Formik>
                </div> <br />  <br />

                <table border={1} className={"table"} >
                    <thead  >
                        <tr>
                            <td><b>Id</b></td>
                            <td><b>ProductName</b></td>
                            <td><b>Price</b></td>
                            <td><b>Quantity</b></td>
                            <td><b>Actions</b></td>
                        </tr>
                    </thead>
                    <tbody>
                        {value.user.map((row) => (
                            <tr >
                                <td>{row.id}</td>
                                <td>{row.name}</td>
                                <td>RS {row.price}</td>
                                <td>{row.quantity}</td>
                                <td><button onClick={() => handleEdit(row.id)} >Edit</button> &nbsp;
                                    <button onClick={() => deleteData(row.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> <br />
            </div>
        </>
    )

}
export default FormikComponent;


