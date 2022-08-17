import React, { useEffect, useState } from "react";
import { Form, Button } from 'react-bootstrap'
import Navigation from "../components/Navigation";
import AddIcon from '../assets/img/AddIcon.png'
import { API } from "../config/api";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";


export default function AddFilm() {

    const [categories, setCategories] = useState([]); //Store all category data
    const [categoryId, setCategoryId] = useState([]); //Save the selected category id
    let navigate = useNavigate()

    const getCategorys = async () => {
        try {
            const response = await API.get('/categorys')
            setCategories(response.data.categories)
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeCategoryId = (e) => {
        const id = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            // Save category id if checked
            setCategoryId([...categoryId, parseInt(id)]);
        } else {
            // Delete category id from variable if unchecked
            let newCategoryId = categoryId.filter((categoryIdItem) => {
                return categoryIdItem != id;
            });
            setCategoryId(newCategoryId);
        }
    };


    console.log(categories);

    const [form, setForm] = useState({
        thumbnail: '',
        title: '',
        description: '',
        price: '',
        filmUrl: '',
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value,
        });
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Store data with FormData as object
            const formData = new FormData();
            formData.set('thumbnail', form.thumbnail[0], form.thumbnail[0].title)
            formData.set('title', form.title)
            formData.set('description', form.description)
            formData.set('price', form.price)
            formData.set('filmUrl', form.filmUrl)
            formData.set('categoryId', categoryId);

            // Configuration
            const config = {
                headers: {
                    'Content-type': "multipart/form-data"
                }
            };

            // Insert product data
            const response = await API.post("/add-film", formData, config);
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        getCategorys();
    }, []);

    return (
        <>
            <Navigation />
            <div className="container">
                <div className="add-product">
                    <div className="add-form">
                        <div className="title"><h2><b>Add Film</b></h2></div>
                        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                            <div className="row">
                                <div className="input-name col-9">
                                    <input onChange={handleChange} type="text" name="title" id="title" placeholder="Title" />
                                </div>
                                <div className="input-photo col-3">
                                    <input onChange={handleChange} type="file" hidden name="thumbnail" id="thumbnail" />
                                    <label htmlFor="thumbnail">Attach Thumbnail<img src={AddIcon} alt="add" /> </label>
                                </div>
                            </div>
                            <div className="card-form-input px-2 py-1 pb-2">
                                <div style={{ color: "white" }}
                                    className="text-secondary mb-1"
                                >
                                    Category
                                </div>
                                {categories.map((item, index) => (
                                    <label style={{ color: "white", paddingLeft: "10px" }} className="checkbox-inline me-4" key={index}>
                                        <input
                                            type="checkbox"
                                            value={item.id}
                                            onClick={handleChangeCategoryId}
                                        />{' '}
                                        {item.name}
                                    </label>
                                ))}
                            </div>
                            <div className="input-price">
                                <input onChange={handleChange} type="number" name="price" id="price" placeholder="Price" />
                            </div>
                            <div className="input-name">
                                <input onChange={handleChange} type="text" name="filmUrl" id="filmUrl" placeholder="Link Film" />
                            </div>
                            <div className="input-description">
                                <textarea onChange={handleChange} name="description" id="description" placeholder="Description"></textarea>
                            </div>
                            <div className="button-add">
                                <Button type="submit">Add Film</Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}