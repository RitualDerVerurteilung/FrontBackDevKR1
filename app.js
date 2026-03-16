const { error } = require('console');
const express = require('express');
const { nanoid } = require('nanoid');
const cors = require("cors");

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

let products = [
    { id: nanoid(6), name: 'Несквик', price: 150, description: 'Несквик прекрасно сочетается с таким товаром как Пи... Молоком. Хорошо сочетается с Молоком.', imgURL: 'https://i.pinimg.com/736x/ac/6b/d1/ac6bd12328661b8b1c06a8e9efe52d91.jpg' },
    { id: nanoid(6), name: 'Молоко', price: 80, description: 'Представляем молоко, которое понимает твою душевную организацию. Такое же белое, как твоя новая водолазка, и такое же нежное, как твой внутренний мир.', imgURL: 'https://main-cdn.sbermegamarket.ru/mid9/hlr-system/-22/017/268/162/712/17/100032481426b0.jpg' },
    { id: nanoid(6), name: 'Сырок', price: 50, description: 'Вкусный, мягкий, сладкий, ммм... Остался лишь в воспоминаниях.', imgURL: 'https://tsx.x5static.net/i/800x800-fit/xdelivery/files/f2/2b/412196a4946040aa45fe57a46779.jpg' },
]

// Middleware для парсинга JSON
app.use(express.json());

// Логирование
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Разрешение политики CORS
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Либо возвращает продукт по id, либо выдаёт 404 и возвращает null
function findProductOr404(id, res) {
    const product = products.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product
}

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API управления товарами',
            version: '1.0.0',
            description: 'Простое API для управления товарами',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    // Путь к файлам, в которых мы будем писать JSDoc-комментарии (наш текущий файл)
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
* @swagger
* components:
*   schemas:
*     Product:
*       type: object
*       required:
*         - name
*         - price
*         - description
*         - imgURL
*       proerties:
*         id:
*           type: string
*           description: Автоматически сгенерированный уникальный ID товара
*         name:
*           type: string
*           description: Имя товара
*         price:
*           type: integer
*           description: Цена пользователя
*         description:
*           type: string
*           description: Описание товара
*         imgURL:
*           type: string
*           description: Ссылка на изображение товара
*       example:
*           id: "abc123"
*           name: "Несквик"
*           price: 50
*           description: "Опсиание товара"
*           imgURL: "https://example.com/dasslow.jpg"
*/
// Главная страница
app.get('/', (req, res) => {
    res.send('Главная страница');
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создаёт новый продукт
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - imgURL
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название продукта
 *                 example: "Ноутбук"
 *               price:
 *                 type: number
 *                 description: Цена продукта (будет преобразована в число)
 *                 example: 999.99
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *                 example: "Мощный игровой ноутбук"
 *               imgURL:
 *                 type: string
 *                 description: Ссылка на изображение продукта
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Продукт успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Уникальный идентификатор продукта (6 символов)
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 imgURL:
 *                   type: string
 */
// POST /api/products
app.post('/api/products', (req, res) => {
    const { name, price, description, imgURL } = req.body;

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        imgURL: imgURL.trim()
    };

    products.push(newProduct);
    res.status(201).json(newProduct); // 201 (Created)
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех продуктов
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список продуктов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// GET /api/products
app.get('/api/products', (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Данные продукта
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Продукт не найден
 */
// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    res.json(product);
});


/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные продукта
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название продукта
 *               price:
 *                 type: number
 *                 description: Новая цена продукта
 *               description:
 *                 type: string
 *                 description: Новое описание продукта
 *               imgURL:
 *                 type: string
 *                 description: Новая ссылка на изображение
 *     responses:
 *       200:
 *         description: Обновленный продукт
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Продукт не найден
 */
// PATCH /api/products/:id
app.patch('/api/products/:id', (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    if (req.body?.name === undefined && req.body?.price === undefined) {
        return res.status(400).json({
            error: "Nothing to update",
        }); // 400 (Bad Request)
    }

    const { name, price, description, imgURL } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description.trim();
    if (imgURL !== undefined) product.imgURL = imgURL.trim();

    res.json(product);
});


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет продукт
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID продукта
 *     responses:
 *       204:
 *         description: Продукт успешно удален (нет тела ответа)
 *       404:
 *         description: Продукт не найден
 */
// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const exists = products.some((u) => u.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter((u) => u.id !== id);

    res.status(204).send(); // 204 (No Content) 
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

//
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" }) //  500 (Internal Server Error)
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});