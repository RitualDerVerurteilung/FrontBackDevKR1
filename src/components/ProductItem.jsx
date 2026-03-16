import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
    return (
        <div className="productCard">
            <img className="productImage" src={product.imgURL} alt="Изображение товара"></img>
            <div className="productMain">
                <div className="productId">#{product.id}</div>
                <div className="productName">{product.name}</div>
                <div className="productPrice">{product.price} эдди</div>
            </div>
            <div className="productDescription">
                <p>{product.description}</p>
            </div>
            <div className="productActions">
                <button className="btn" onClick={() => onEdit(product)}>
                    Редактировать
                </button>
                <button className="btn btn--danger" onClick={() =>
                    onDelete(product.id)}>
                    Удалить
                </button>
            </div>
        </div>
    );
}