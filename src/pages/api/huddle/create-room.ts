import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = await axios.post(
      "https://us-central1-nfts-apis.cloudfunctions.net/createroom",
      {
        title: "test1",
        roomLock: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.HUDDLE01_API_KEY,
        },
      }
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
