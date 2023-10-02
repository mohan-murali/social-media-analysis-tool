// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
//@ts-ignore
import word2vec from "word2vec";
import clientPromise from "../../utils/mongodb";

type Data = {
  name?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { query } = req;

    const { hashtag } = query;
    console.log(hashtag);
    if (hashtag) {
      const keyword = hashtag[0] === "#" ? hashtag.slice(1) : hashtag;

      console.log(keyword);
      const client = await clientPromise;
      const db = client.db("social-media-data");
      const readings = (await db.collection("Keywords").find({}).toArray()).map(
        (keyword) => ({
          hashTag: keyword.HashTag.slice(1),
        })
      );

      let response = [];

      word2vec.loadModel("./numberbatch-en-19.08.txt", (model: any) => {
        if (!model) {
          console.log("Failed to load Word2Vec model.");
          return;
        }

        const targetWord = keyword;

        const similarWords = model.mostSimilar(targetWord, 10);

        console.log(`Similar words for '${targetWord}':`);
        similarWords.forEach((word: any) => {
          console.log(`${word.word} - Similarity: ${word.dist}`);
        });
      });
    }

    res.status(200).json({ name: "jon doe" });
  } catch (ex: any) {
    console.error(ex);
    return res.status(500).json({
      message: ex.message,
    });
  }
}
