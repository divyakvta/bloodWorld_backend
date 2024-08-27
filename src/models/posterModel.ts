import { model, Schema } from "mongoose";


interface IPoster extends Document {
    url: string;
    title: string;
}

const PosterSchema = new Schema<IPoster>({
    url: { 
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

const Poster = model<IPoster>('Poster', PosterSchema);

export default Poster;