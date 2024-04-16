import Zod from "zod";
import i18next from "i18next";

export default {
  noEmptySchema: () => {
    return Zod.string().refine(
      (value) => {
        return value.trim().length > 0;
      },
      {
        message: i18next.t(`validation.noempty`),
      },
    );
  },
};
