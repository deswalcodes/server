import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from 'dotenv';
config();
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector"

const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY
});
export const vectorStore = await PGVectorStore.initialize(embeddings,{
    postgresConnectionOptions : {
        connectionString : process.env.DB_URL,
    },
    tableName : 'transcripts',
    columns  : {
        idColumnName : 'id',
        vectorColumnName : 'vector',
        contentColumnName : 'content',
        metadataColumnName : 'metadata'
    },
    distanceStrategy : 'cosine'
});


export const addYTVideoToVectorStore = async (videoData) => {
    const docs = [
        new Document({
            pageContent: videoData.transcript,
            metadata: { video_id: videoData.video_id }
        })
    ];
    
    
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });
    const chunks = await splitter.splitDocuments(docs);

    await vectorStore.addDocuments(chunks);

} 