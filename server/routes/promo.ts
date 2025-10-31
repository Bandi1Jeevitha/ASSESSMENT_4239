import { RequestHandler } from "express";

interface PromoCode {
  code: string;
  discount: number;
  active: boolean;
}

const promoCodes: PromoCode[] = [
  { code: "SAVE10", discount: 100, active: true },
  { code: "FLAT100", discount: 100, active: true },
  { code: "WELCOME50", discount: 50, active: true },
  { code: "TRAVEL20", discount: 200, active: true },
];

export const handleValidatePromo: RequestHandler = (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.json({
      valid: false,
      discount: 0,
      code: "",
    });
  }

  const upperCode = code.toUpperCase().trim();
  const promo = promoCodes.find((p) => p.code === upperCode && p.active);

  if (!promo) {
    return res.json({
      valid: false,
      discount: 0,
      code: upperCode,
    });
  }

  res.json({
    valid: true,
    discount: promo.discount,
    code: promo.code,
  });
};
