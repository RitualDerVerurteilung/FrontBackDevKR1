import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imgURL, setImgURL] = useState("");

    useEffect(() => {
        if (!open) return;
        setName(initialProduct?.name ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setDescription(initialProduct?.description ?? "")
        setImgURL(initialProduct?.imgURL ?? "")
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование товара" : "Создание товара";

    const isValidUrl = (str) => {
        try {
            return !!new URL(str);
        }
        catch (_) {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed_name = name.trim();
        const parsedPrice = Number(price);
        const trimmed_description = description.trim();
        const trimmed_imgURL = imgURL.trim();
        if (!trimmed_name) {
            alert("Введите имя");
            return;
        }
        if (!Number.isFinite(parsedPrice) || parsedPrice < 1) {
            alert("Введите корректную цену (больше 0)");
            return;
        }
        if (!trimmed_description) {
            alert("Введите описание");
            return;
        }
        if (!isValidUrl(trimmed_imgURL)) {
            alert("Введите корректную ссылку на изображение");
            return;
        }
        onSubmit({
            id: initialProduct?.id,
            name: trimmed_name,
            price: parsedPrice,
            description: trimmed_description,
            imgURL: trimmed_imgURL
        });
    }
    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}
                role="dialog" aria-modal="true">
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose} aria
                        label="Закрыть">
                        ✕

                    </button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Имя
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например, Несквик"
                            autoFocus
                        />
                    </label>
                    <label className="label">
                        Цена
                        <input
                            className="input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Например, 20"
                            inputMode="numeric"
                        />
                    </label>
                    <label className="label">
                        Описание
                        <input
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Например, полезный завтрак для всей семьи"
                        />
                    </label>
                    <label className="label">
                        Ссылка на изображение
                        <input
                            className="input"
                            value={imgURL}
                            onChange={(e) => setImgURL(e.target.value)}
                            placeholder="Например, https://example.com/dasslow.jpg"
                        />
                    </label>
                    <div className="modal__footer">
                        <button type="button" className="btn" onClick=
                            {onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}