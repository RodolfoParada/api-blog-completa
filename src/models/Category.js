// src/models/Category.js
// Simulación de una estructura de categoría
const categories = [];
let categoryIdCounter = 1;

exports.getAll = () => categories;

exports.create = (name) => {
    const newCategory = {
        id: categoryIdCounter++,
        name: name,
        slug: name.toLowerCase().replace(/\s/g, '-')
    };
    categories.push(newCategory);
    return newCategory;
};