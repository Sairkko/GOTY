// pages/Register.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const validationSchema = Yup.object({
        name: Yup.string().required('Nom requis'),
        lastname: Yup.string().required('Prénom requis'),
        username: Yup.string().required('Pseudo requis'),
        email: Yup.string().email('Email invalide').required('Email requis'),
        password: Yup.string().min(6, 'Le mot de passe doit avoir au moins 6 caractères').required('Mot de passe requis')
    });

    const handleRegister = (values) => {
        const { name, email, lastname, username, password } = values;
        if (name && email && lastname && username && password) {
            const userData = { name, email, lastname, username, password };
            localStorage.setItem('user', JSON.stringify(userData));

            login(userData);

            alert('Inscription réussie !');
            navigate('/login');
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-4">Inscription</h1>
            <Formik
                initialValues={{
                    name: '',
                    lastname: '',
                    username: '',
                    email: '',
                    password: ''
                }} // Initialiser toutes les valeurs
                validationSchema={validationSchema}
                onSubmit={handleRegister}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-4">
                            <label>Nom:</label>
                            <Field
                                type="text"
                                name="name"
                                className="border p-2 w-full"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Prénom:</label>
                            <Field
                                type="text"
                                name="lastname"
                                className="border p-2 w-full"
                            />
                            <ErrorMessage
                                name="lastname"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Pseudo:</label>
                            <Field
                                type="text"
                                name="username"
                                className="border p-2 w-full"
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Email:</label>
                            <Field
                                type="email"
                                name="email"
                                className="border p-2 w-full"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label>Mot de passe:</label>
                            <Field
                                type="password"
                                name="password"
                                className="border p-2 w-full"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white p-2 rounded"
                            disabled={isSubmitting}
                        >
                            S'inscrire
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
