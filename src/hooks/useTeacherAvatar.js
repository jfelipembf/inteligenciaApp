import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 dias

const useTeacherAvatar = (teacher, schoolId) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (!teacher || !schoolId) return;

    const avatar = teacher.personalInfo?.avatar;
    if (!avatar) return;

    const cacheKey = `avatar_${schoolId}_${avatar}`;
    const cached = localStorage.getItem(cacheKey);
    let useCache = false;
    if (cached) {
      try {
        const { url, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          setAvatarUrl(url);
          useCache = true;
        }
      } catch {}
    }
    if (!useCache) {
      const fetchAvatar = async () => {
        try {
          const ref = firebase
            .storage()
            .ref(`${schoolId}/profileImages/${avatar}`);
          const url = await ref.getDownloadURL();
          setAvatarUrl(url);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ url, timestamp: Date.now() })
          );
        } catch {
          setAvatarUrl(null);
        }
      };
      fetchAvatar();
    }
  }, [teacher, schoolId]);

  return avatarUrl;
};

export default useTeacherAvatar;
