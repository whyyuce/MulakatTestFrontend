// Örnek bir fonksiyon, projeleri almak için bir GET isteği yapar
export const fetchProjects = async () => {
  try {
    // GET isteği yapılıyor ve yanıt bekleniyor
    const response = await fetch('http://localhost:3000/api/project');

    // Yanıtın JSON formatına dönüştürülmesi ve verilerin alınması
    const data = await response.json();
    console.log('data', data);

    // Başarılı bir yanıt alındığında verileri döndür
    return data;
  } catch (error) {
    // Hata durumunda uygun şekilde ele al
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};
export const fetchFiles = async (remarkId) => {
  try {
    // GET isteği yapılıyor ve yanıt bekleniyor
    const response = await fetch(`http://localhost:3000/api/comments/remarks/${remarkId}/comments`);

    // Yanıtın JSON formatına dönüştürülmesi ve verilerin alınması
    const data = await response.json();
    console.log('data', data);

    // Başarılı bir yanıt alındığında verileri döndür
    return data;
  } catch (error) {
    // Hata durumunda uygun şekilde ele al
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

// Diğer istekler için de benzer fonksiyonlar oluşturabilirsiniz

// Örnek bir fonksiyon, tipleri almak için bir GET isteği yapar
export const fetchTypes = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/types');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching types:', error);
    throw new Error('Failed to fetch types');
  }
};

// Örnek bir fonksiyon, konuları almak için bir GET isteği yapar
export const fetchTopics = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/topic');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to fetch topics');
  }
};

// Örnek bir fonksiyon, kullanıcıları almak için bir GET isteği yapar
export const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};
