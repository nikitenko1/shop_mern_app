export const uploadFile = async (files, type) => {
  const images = [];

  for (const file of files) {
    const formData = new FormData();

    formData.append('file', file);
    type === 'avatar'
      ? formData.append('upload_preset', 'jobs_avatar')
      : type === 'newsletter'
      ? formData.append('upload_preset', 'jobs_cv')
      : type === 'category'
      ? formData.append('upload_preset', 'jobs_category')
      : formData.append('upload_preset', 'learnify');
    formData.append('cloud_name', `${process.env.REACT_APP_CLOUD_NAME}`);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      images.push(data.secure_url);
    } catch (err) {
      console.log(err);
    }
  }

  return images;
};
