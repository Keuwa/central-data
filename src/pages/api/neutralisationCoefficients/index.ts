import { NeutralizationCoefficient } from "../../../database/entity/neutralizationCoefficient";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin";
import { converter } from "../../../database/firebaseConverter";

import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      let getResult = await new Promise(async (resolve) => {
        let data = await getNeutralisationCoefficients();
        resolve(data);
      });
      res.status(200).json(getResult);
      break;
    case "POST":
      let postResult = await new Promise(async (resolve) => {
        let data = await addNeutralisationCoefficient(req.body);
        resolve(data);
      });
      res.status(200).json(postResult);
      break;
    case "PUT":
      let updatedPost = await new Promise(async (resolve) => {
        let data = await updateNeutralisationCoefficients(req.body);
        resolve(data);
      });
      res.status(200).json(updatedPost);
      break;
    case "DELETE":
      let deletedPost = await new Promise(async (resolve) => {
        let data = await deleteNeutralisationCoefficients(req.body);
        resolve(data);
      });
      res.status(200).json(deletedPost);
      break;
    default:
      res.status(401).json({ error: "Method not allowed" });
      break;
  }
};

export async function getNeutralisationCoefficients(
  cityInseeCode?: string | string[],
  year?: string | string[]
): Promise<Array<NeutralizationCoefficient>> {
  let neutralizationCoefficients: Array<NeutralizationCoefficient> = [];
  try {
    const db = firebaseAdmin.firestore();
    let ref = db.collection("neutralizationCoefficients");
    let query = ref.orderBy("startDate");
    if (cityInseeCode) {
      if (typeof cityInseeCode === "string") {
        query = ref.where("city", "==", cityInseeCode);
      } else {
        query = ref.where("city", "in", cityInseeCode);
      }
      if (year) {
        if (typeof year === "string") {
          query = query.where("startDate", "<", year);
          query = query.where("endDate", ">", year);
        }
      }
    } else if (year) {
      if (typeof year === "string") {
        query = query.where("startDate", "<", year);
        query = query.where("endDate", ">", year);
      }
    }

    const snapshot = await query.get();
    console.log(snapshot.size);
    snapshot.forEach((doc) => {
      let neutralisationCoefficient: NeutralizationCoefficient = {
        firebaseID: doc.id,
        ...doc.data(),
      };
      neutralizationCoefficients.push(neutralisationCoefficient);
    });
    return neutralizationCoefficients;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function addNeutralisationCoefficient(
  neutralisationCoefficient: NeutralizationCoefficient
) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection("neutralizationCoefficients")
      .withConverter(converter())
      .add(neutralisationCoefficient)
      .then((data) => {
        resolve({ id: data.id, ...neutralisationCoefficient });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateNeutralisationCoefficients(
  neutralisationCoefficient: NeutralizationCoefficient
) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection("neutralizationCoefficients")
      .doc(neutralisationCoefficient.firebaseID)
      .withConverter(converter())
      .update(neutralisationCoefficient)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteNeutralisationCoefficients(
  neutralisationCoefficient: NeutralizationCoefficient
) {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .firestore()
      .collection("neutralizationCoefficients")
      .doc(neutralisationCoefficient.firebaseID)
      .withConverter(converter())
      .delete()
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
