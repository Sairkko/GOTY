// pages/Login.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const validationSchema = Yup.object({
        email: Yup.string().email('Email invalide').required('Email requis'),
        password: Yup.string().required('Mot de passe requis')
    });

    const handleLogin = (values) => {
        const { email, password } = values;

        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && email === storedUser.email && password === storedUser.password) {
            login(storedUser)
            navigate('/');
        } else {
            alert('Identifiants incorrects');
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-4">Connexion</h1>
            <Formik
                initialValues={{ email: '', password: '' }} // Assurez-vous d'initialiser les champs
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ isSubmitting }) => (
                    <Form>
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
                            className="bg-blue-500 text-white p-2 rounded"
                            disabled={isSubmitting}
                        >
                            Se connecter
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
