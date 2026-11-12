"""Corrige texto bordado quando o vídeo é espelhado: rastreia o texto no quadro original (F) e cola o
recorte legível na posição espelhada (M) com borda suave. Só aplica quando o texto está visível
(sem mão na frente) — se a correlação cai, deixa o quadro como está."""
import cv2, numpy as np

class TextFix:
    ROTS = [-9, -6, -3, 0, 3, 6]; SCALES = [0.82, 0.9, 1.0, 1.1, 1.2]
    def __init__(self, tmpl_bgr, pad=26, feather=14, thr=0.55):
        g = cv2.cvtColor(tmpl_bgr, cv2.COLOR_BGR2GRAY); self.th, self.tw = g.shape
        self.pad, self.feather, self.thr = pad, feather, thr
        self.var = {}
        for r in self.ROTS:
            for s in self.SCALES:
                M = cv2.getRotationMatrix2D((self.tw / 2, self.th / 2), r, s)
                w, h = int(self.tw * s), int(self.th * s); M[0, 2] += w / 2 - self.tw / 2; M[1, 2] += h / 2 - self.th / 2
                self.var[(r, s)] = cv2.warpAffine(g, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        self.small = {k: cv2.resize(v, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA) for k, v in self.var.items()}
        self.reset()
    def reset(self): self.pos = None; self.key = None; self.score = 0.0; self.lost = 0
    def _best(self, roi, keys, bank):
        best = (-1, None, None)
        for k in keys:
            t = bank[k]
            if roi.shape[0] <= t.shape[0] or roi.shape[1] <= t.shape[1]: continue
            r = cv2.matchTemplate(roi, t, cv2.TM_CCOEFF_NORMED); _, sc, _, (x, y) = cv2.minMaxLoc(r)
            if sc > best[0]: best = (sc, (x + t.shape[1] // 2, y + t.shape[0] // 2), k)
        return best
    def _near(self, k):
        r, s = k; ri = self.ROTS.index(r); si = self.SCALES.index(s)
        return [(self.ROTS[a], self.SCALES[b]) for a in range(max(0, ri - 1), min(len(self.ROTS), ri + 2)) for b in range(max(0, si - 1), min(len(self.SCALES), si + 2))]
    def locate(self, F):
        gray = cv2.cvtColor(F, cv2.COLOR_BGR2GRAY); H, W = gray.shape
        if self.pos is not None and self.score >= 0.4:
            cx, cy = self.pos; rx, ry = self.tw // 2 + 90, self.th // 2 + 90
            x0, y0 = max(0, cx - rx), max(0, cy - ry)
            sc, p, k = self._best(gray[y0:cy + ry, x0:cx + rx], self._near(self.key), self.var)
            if p is not None and sc >= 0.4:
                self.pos, self.key, self.score, self.lost = (x0 + p[0], y0 + p[1]), k, sc, 0; return
        self.lost += 1
        if self.lost % 4 != 1 and self.pos is not None: self.score = 0.0; return      # busca global só de vez em quando
        y0 = int(H * 0.45); sm = cv2.resize(gray[y0:], None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
        sc, p, k = self._best(sm, list(self.small), self.small)
        if p is None or sc < 0.45: self.score = max(sc, 0.0) if sc < 0.4 else 0.39; return
        cx, cy = p[0] * 2, y0 + p[1] * 2; rx, ry = self.tw // 2 + 40, self.th // 2 + 40
        x0, yy0 = max(0, cx - rx), max(0, cy - ry)
        sc2, p2, k2 = self._best(gray[yy0:cy + ry, x0:cx + rx], self._near(k), self.var)
        if p2 is None: self.score = 0.0; return
        self.pos, self.key, self.score, self.lost = (x0 + p2[0], yy0 + p2[1]), k2, sc2, 0
    def apply(self, F, M):
        self.locate(F)
        if self.pos is None or self.score < self.thr: return M
        H, W = F.shape[:2]; t = self.var[self.key]; cx, cy = self.pos
        w = t.shape[1] + 2 * self.pad; h = t.shape[0] + 2 * self.pad
        x = max(0, min(W - w, int(cx - w / 2))); y = max(0, min(H - h, int(cy - h / 2)))
        patch = F[y:y+h, x:x+w]; mx = W - x - w; f = self.feather
        mask = np.zeros((h, w), np.float32); mask[f:h-f, f:w-f] = 1; mask = cv2.GaussianBlur(mask, (0, 0), f / 2)[..., None]
        M[y:y+h, mx:mx+w] = (M[y:y+h, mx:mx+w] * (1 - mask) + patch * mask).astype(np.uint8)
        return M
