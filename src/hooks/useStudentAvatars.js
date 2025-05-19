import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 7;

const useStudentAvatars = (students, schoolId) => {
  const [avatarUrls, setAvatarUrls] = useState({});

  useEffect(() => {
    if (!students || !schoolId) return;

    const fetchAvatars = async () => {
      const urls = {};
      await Promise.all(
        students.map(async (student) => {
          const avatar = student.personalInfo?.avatar;
          if (!avatar) return;

          const cacheKey = `avatar_${schoolId}_${avatar}`;
          const cached = localStorage.getItem(cacheKey);
          let useCache = false;
          if (cached) {
            try {
              const { url, timestamp } = JSON.parse(cached);
              if (Date.now() - timestamp < CACHE_EXPIRATION) {
                urls[student.id] = url;
                useCache = true;
              }
            } catch {}
          }
          if (!useCache) {
            try {
              const ref = firebase
                .storage()
                .ref(`${schoolId}/profileImages/${avatar}`);
              const url = await ref.getDownloadURL();
              urls[student.id] = url;
              localStorage.setItem(
                cacheKey,
                JSON.stringify({ url, timestamp: Date.now() })
              );
            } catch {
              urls[student.id] = null;
            }
          }
        })
      );
      setAvatarUrls(urls);
    };

    fetchAvatars();
  }, [students, schoolId]);

  return avatarUrls;
};

export default useStudentAvatars;
