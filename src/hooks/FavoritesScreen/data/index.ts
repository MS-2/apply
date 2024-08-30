import { Hit } from "@/types/algoliaResponse";
import { executeCommand, executeQuery } from "@/utils/sql_util";

// SQL Queries as constants
const DELETE_FROM_FAVORITES = `DELETE FROM favorites WHERE objectID = ?`;
const SELECT_FAVORITE_HITS = `SELECT * FROM favorites`;

export const removeFromFavorite = async (objectID: string) => {
  await executeCommand(DELETE_FROM_FAVORITES, [objectID]);
};

export const getFavorites = async (): Promise<Hit[]> => {
  return await executeQuery<Hit>(SELECT_FAVORITE_HITS);
};
