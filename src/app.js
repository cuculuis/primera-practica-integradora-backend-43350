import  express  from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { PORT, __dirname } from "./utils.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

import { messageModel } from "./DAO/ModelSchemas/MessageModel.js";
import { productRouter } from "./Routers/productRoutes.js"
import { cartRouter } from "./Routers/cartRoutes.js"

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));

const httpServer = app.listen(PORT, () => {
    console.log(`Server Listening in Port: ${PORT}`);
})

const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('A new user connected');

    socket.on("productList", (data) => {
        
        io.emit("updatedProducts", data);
    });

    let messages = (await messageModel.find()) ? await messageModel.find() : [];

    socket.broadcast.emit("alerta");
    socket.emit("logs", messages);
    socket.on("message", (data) => {
        messages.push(data);
        messageModel.create(messages);
        io.emit("logs", messages);
        });
    });
