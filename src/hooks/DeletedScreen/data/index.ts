import { Hit } from "@/types/algoliaResponse";
import { executeCommand, executeQuery } from "@/utils/sql_util";

// SQL queries as constants
const DELETE_FROM_DELETED = `DELETE FROM deleted WHERE objectID = ?`;
const SELECT_DELETED = `SELECT * FROM deleted`;

export const removeFromDeleted = async (objectID: string) => {
  await executeCommand(DELETE_FROM_DELETED, [objectID]);
};

export const getDeleted = async (): Promise<Hit[]> => {
  return await executeQuery<Hit>(SELECT_DELETED);
};
