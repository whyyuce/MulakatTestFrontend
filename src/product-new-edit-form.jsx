import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  fetchUsers,
  fetchTypes,
  fetchFiles,
  fetchTopics,
  fetchProjects,
} from 'src/api/remarkrequests';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFSelect,
  RHFUpload,
  RHFTextField,
} from 'src/components/hook-form';

export default function ProductNewEditForm({ currentProduct }) {
  const currentProduc = useLocation();
  console.log('curr', currentProduc);
  const mydraft = currentProduc ? currentProduc.state?.rowData : null;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.toString()} (${
      Intl.DateTimeFormat().resolvedOptions().timeZone
    })`;
    return formattedDate;
  };

  const formattedDate = currentProduc.state?.rowData
    ? formatDate(currentProduc.state.rowData?.lastdate)
    : null;
  const [isLoading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [types, setTypes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);

  const [filedata, setFileData] = useState([]);

  const [savedata, setSave] = useState([false]);
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    project: Yup.string().required('Project is required'),
    owner: Yup.string().required('Owner is required'),
    topic: Yup.string().required('Topic is required'),
    type: Yup.string().required('Type is required'),
    name: Yup.string().required('Remark Title is required'),
    createDate: Yup.date().required('Due Date is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array(),
  });
  // formattedDate || TODO: datetime kısmı edit ile gelmiyor.
  const defaultValues = useMemo(
    () => ({
      project: mydraft?.project || 'NB001',
      owner: mydraft?.owner || 'Jacob',
      topic: mydraft?.topic || 'Desing',
      type: mydraft?.type || 'Owner',
      name: mydraft?.title || '',
      createDate: formattedDate ? new Date(formattedDate) : null,
      description: mydraft?.desc || null,
      images: mydraft?.images || [],
    }),
    [mydraft]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });
  const createRemark = async (formData) => {
    console.log('formdata', formData);
    try {
      const date = new Date(formData.createDate);
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      let savedetail;
      if (savedata === false) {
        savedetail = 'Draft'; // = operatörü kullanılmalı
      } else {
        savedetail = 'Published'; // = operatörü kullanılmalı
      }

      const requestBody = {
        project: formData.project,
        statu: savedetail, // Değişken adı düzeltilmeli (statu -> status)
        type: formData.type,
        writer: 'User-1',
        topic: formData.topic,
        owner: formData.owner,
        lastdate: formattedDate,
        title: formData.name,
        desc: formData.description,
      };

      const response = await fetch('http://localhost:3000/api/remarks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to create remark');
      }

      const data = await response.json();
      console.log('datam', data);
      return data.data.remark._id; // Remark ID'sini döndür
    } catch (error) {
      console.error('Error creating remark:', error);
      throw error;
    }
  };

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [fetchProjects(), fetchTypes(), fetchTopics(), fetchUsers()];
        let filedata = null;
        console.log('myd', mydraft);
        if (mydraft?._id) {
          filedata = await fetchFiles(mydraft._id);
          console.log('filedata', filedata);
        }

        const [projectsData, typesData, topicsData, usersData] = await Promise.all(promises);

        console.log('pr1', usersData);
        setProjects(projectsData.data);
        setTypes(typesData.data);
        setTopics(topicsData.data);
        setUsers(usersData.data);
        if (filedata) {
          // Eğer filedata varsa, yani fetchFiles başarılı olduysa, filedata'yı ayarla
          // Aksi halde filedata zaten null olacak
          // Bu, filedata null veya doluysa çalışır
          setFileData(filedata);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('data1', data);
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      const remarkId = await createRemark(data); // createRemark fonksiyonunu çağır ve remark ID'sini al
      const formData = new FormData();
      data.images.forEach((file, index) => {
        console.log('data.images', data.images);
        // Her dosya için bir alan adı belirleyin, örneğin "file1", "file2" vb.
        const fieldName = `file${index + 1}`;
        // FormData'ya dosyayı ekleyin
        formData.append('files', file);
      });

      console.log('formdata', formData);
      // Dosyaları ilişkilendirilmiş remark ile yükle
      const uploadResponse = await fetch(`http://localhost:3000/api/file/upload/${remarkId}`, {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
      }
      const uploadData = await uploadResponse.json();
      console.log('Files uploaded successfully:', uploadData);

      // Dosyalar yüklendikten sonra, kullanıcının girdiği metni içeren bir comment oluşturmak için istek yap
      const commentResponse = await fetch('http://localhost:3000/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remarkId,
          text: 'Remark Created', // Kullanıcının girdiği metin
          files: uploadData.fileIds, // Yüklenen dosyaların ID'leri
        }),
      });

      if (!commentResponse.ok) {
        throw new Error('Failed to add comment');
      }
      const commentData = await commentResponse.json();
      console.log('Comment added successfully:', commentData);
      customReset();
    } catch (error) {
      console.error(error);
    }
  });
  const customReset = () => {
    setValue('description', ''); // Set the description field to an empty string
    reset(); // Reset the form data
  };

  const handlenavigate = () => {
    router.push(paths.dashboard.product.root, { state: { Data: 'Draft' } });
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      console.log('acc', acceptedFiles);
      const files = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('images', files);
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('images', []);
  }, [setValue]);
  const handleDraftListClick = () => {
    setSave(false); // Draft List butonuna tıklandığında savedata'yı false olarak ayarla
  };

  const handleSaver = () => {
    setSave(true); // Save Changes butonuna tıklandığında savedata'yı true olarak ayarla
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={0}>
        <Grid xs={12} md={6}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Box
                  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFSelect
                    native
                    name="project"
                    label="Project"
                    defaultValue="NB001"
                    InputLabelProps={{ shrink: true }}
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.project_name}>
                        {project.project_name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    name="owner"
                    label="Owner"
                    defaultValue="aysenur"
                    InputLabelProps={{ shrink: true }}
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.first_name}>
                        {user.first_name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    name="topic"
                    label="Topic"
                    defaultValue="Dizayn"
                    InputLabelProps={{ shrink: true }}
                  >
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.topic_name}>
                        {topic.topic_name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    name="type"
                    label="Type"
                    defaultValue="Armatör"
                    InputLabelProps={{ shrink: true }}
                  >
                    {types.map((type) => (
                      <option key={type.id} value={type.type_name}>
                        {type.type_name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFTextField name="name" label="Remark Title" />
                  <Controller
                    name="createDate"
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Due Date"
                        value={field.value}
                        minDate={new Date()}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Box>
                <Divider sx={{ borderStyle: 'dashed' }} />
              </Stack>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack sx={{ p: 3 }}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Description</Typography>
                  <RHFEditor simple name="description" />
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Images</Typography>
                  <RHFUpload
                    multiple
                    thumbnail
                    name="images"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                  />
                </Stack>
              </Stack>
            </Card>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <LoadingButton
                color="primary"
                size="large"
                variant="outlined"
                loading={isSubmitting}
                onClick={() => {
                  handleSaver(); // Set saveData to true
                  handleSubmit(onSubmit)(); // Trigger form submission
                }}
              >
                Publish Remark
              </LoadingButton>
            </Stack>
            <Stack justifyContent="flex-end" direction="row" spacing={2}>
              <LoadingButton
                color="inherit"
                size="large"
                variant="outlined"
                loading={isSubmitting}
                onClick={() => {
                  handleDraftListClick(); // Set saveData to false
                  handleSubmit(onSubmit)(); // Trigger form submission
                }}
              >
                Save Draft
              </LoadingButton>
              <LoadingButton
                color="inherit"
                loadingPosition="start"
                type="submit"
                variant="outlined"
                size="large"
                loading={isSubmitting}
                onClick={handlenavigate}
              >
                Draft List
              </LoadingButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
