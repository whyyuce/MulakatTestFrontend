import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFMultiCheckbox } from 'src/components/hook-form';

const TOUR_SERVICE_OPTIONS = [
  { value: 'Audio guide', label: 'Audio guide' },
  { value: 'Food and drinks', label: 'Food and drinks' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Private tour', label: 'Private tour' },
  { value: 'Special activities', label: 'Special activities' },
  { value: 'Entrance fees', label: 'Entrance fees' },
  { value: 'Gratuities', label: 'Gratuities' },
  { value: 'Pick-up and drop off', label: 'Pick-up and drop off' },
  { value: 'Professional guide', label: 'Professional guide' },
  {
    value: 'Transport by air-conditioned',
    label: 'Transport by air-conditioned',
  },
];
const REMARK_MODULE_PERMISSIONS = [
  { value: 'remark_visible', label: 'Remark Visible' },
  { value: 'remark_read', label: 'Read Remark' },
  { value: 'remark_write', label: 'Write Remark' },
  { value: 'remark_update', label: 'Update Remark' },
  { value: 'remark_delete', label: 'Delete Remark' },
  { value: 'remark_approve', label: 'Approve Remark' },
  { value: 'remark_view_all', label: 'View All Remarks' },
  { value: 'remark_assign', label: 'Assign Remark' },
  { value: 'remark_export', label: 'Export Remark Data' },
  { value: 'remark_manage_tags', label: 'Manage Remark Tags' },
  { value: 'remark_add_comment', label: 'Add Comment to Remark' },
];
const CONSTRUCTION_MODULE_PERMISSIONS = [
  { value: 'construction_read', label: 'Read Construction' },
  { value: 'construction_write', label: 'Write Construction' },
  { value: 'construction_update', label: 'Update Construction' },
  { value: 'construction_delete', label: 'Delete Construction' },
  { value: 'construction_approve', label: 'Approve Construction' },
  { value: 'construction_view_all', label: 'View All Constructions' },
  { value: 'construction_assign', label: 'Assign Construction' },
  { value: 'construction_export', label: 'Export Construction Data' },
  { value: 'construction_manage_tags', label: 'Manage Construction Tags' },
  { value: 'construction_add_comment', label: 'Add Comment to Construction' },
];

const USER_MANAGEMENT_PERMISSIONS = [
  { value: 'view_user', label: 'View User' },
  { value: 'read_user', label: 'Read User' },
  { value: 'create_user', label: 'Create User' },
  { value: 'update_user', label: 'Update User' },
];

const _PERMISSIONS = [
  { value: 'view', label: 'View' },
  { value: 'read', label: 'Read' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
];
const _PERMISSIONS1 = [
  { value: 'view', label: 'NB001' },
  { value: 'read', label: 'NB002' },
  { value: 'create', label: 'NB003' },
  { value: 'update', label: 'NB004' },
];

const CONTENT_MANAGEMENT_PERMISSIONS = [
  { value: 'view_content', label: 'View Content' },
  { value: 'read_content', label: 'Read Content' },
  { value: 'create_content', label: 'Create Content' },
  { value: 'update_content', label: 'Update Content' },
];
const DESIGN_DOCUMENT_MODULE_PERMISSIONS = [
  { value: 'design_read', label: 'Read Design Document' },
  { value: 'design_write', label: 'Write Design Document' },
  { value: 'design_update', label: 'Update Design Document' },
  { value: 'design_delete', label: 'Delete Design Document' },
  { value: 'design_approve', label: 'Approve Design Document' },
  { value: 'design_view_all', label: 'View All Design Documents' },
  { value: 'design_assign', label: 'Assign Design Document' },
  { value: 'design_export', label: 'Export Design Document Data' },
  { value: 'design_manage_tags', label: 'Manage Design Document Tags' },
  { value: 'design_add_comment', label: 'Add Comment to Design Document' },
];

// ----------------------------------------------------------------------

export default function TourNewEditForm({ currentTour }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTourSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    content: Yup.string().required('Content is required'),
    images: Yup.array().min(1, 'Images is required'),
    //
    tourGuides: Yup.array().min(1, 'Must have at least 1 guide'),
    durations: Yup.string().required('Duration is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    services: Yup.array().min(2, 'Must have at least 2 services'),
    destination: Yup.string().required('Destination is required'),
    available: Yup.object().shape({
      startDate: Yup.mixed().nullable().required('Start date is required'),
      endDate: Yup.mixed()
        .required('End date is required')
        .test(
          'date-min',
          'End date must be later than start date',
          (value, { parent }) => value.getTime() > parent.startDate.getTime()
        ),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTour?.name || '',
      content: currentTour?.content || '',
      images: currentTour?.images || [],
      //
      tourGuides: currentTour?.tourGuides || [],
      tags: currentTour?.tags || [],
      durations: currentTour?.durations || '',
      destination: currentTour?.destination || '',
      services: currentTour?.services || [],
      available: {
        startDate: currentTour?.available.startDate || null,
        endDate: currentTour?.available.endDate || null,
      },
    }),
    [currentTour]
  );

  const methods = useForm({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTour) {
      reset(defaultValues);
    }
  }, [currentTour, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.tour.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  // const renderDetails = (
  //   <>
  //     {mdUp && (
  //       <Grid md={4}>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Details
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Title, short description, image...
  //         </Typography>
  //       </Grid>
  //     )}

  //     <Grid xs={12} md={8}>
  //       <Card>
  //         {!mdUp && <CardHeader title="Details" />}

  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Name</Typography>
  //             <RHFTextField name="name" placeholder="Ex: Adventure Seekers Expedition..." />
  //           </Stack>

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Content</Typography>
  //             <RHFEditor simple name="content" />
  //           </Stack>

  //           <Stack spacing={1.5}>
  //             <Typography variant="subtitle2">Images</Typography>
  //             <RHFUpload
  //               multiple
  //               thumbnail
  //               name="images"
  //               maxSize={3145728}
  //               onDrop={handleDrop}
  //               onRemove={handleRemoveFile}
  //               onRemoveAll={handleRemoveAllFiles}
  //               onUpload={() => console.info('ON UPLOAD')}
  //             />
  //           </Stack>
  //         </Stack>
  //       </Card>
  //     </Grid>
  //   </>
  // );

  const renderProperties = (
    <Grid xs={12} md={12}>
      <Card>
        {!mdUp && <CardHeader title="Properties" />}

        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}
            >
              <Grid item xs={6}>
                <Typography variant="subtitle2">General Management</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RHFMultiCheckbox
                  name="services"
                  options={_PERMISSIONS}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
          <Stack spacing={1.5}>
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}
            >
              <Grid item xs={6}>
                <Typography variant="subtitle2">PROJECTS</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RHFMultiCheckbox
                  name="services"
                  options={_PERMISSIONS1}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                  }}
                />
              </Grid>
            </Grid>
          </Stack>

          <Stack spacing={1.5}>
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}
            >
              <Grid item xs={6}>
                <Typography variant="subtitle2">Content Management</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RHFMultiCheckbox
                  name="services"
                  options={_PERMISSIONS}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
          <Stack spacing={1.5}>
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}
            >
              <Grid item xs={6}>
                <Typography variant="subtitle2">User Management</Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RHFMultiCheckbox
                  name="services"
                  options={_PERMISSIONS}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                  }}
                />
              </Grid>
            </Grid>
          </Stack>

          <Stack>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Remark Module
            </Typography>
            <RHFMultiCheckbox
              name="services"
              options={REMARK_MODULE_PERMISSIONS}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle1">Consturction Module</Typography>
            <RHFMultiCheckbox
              name="services"
              options={CONSTRUCTION_MODULE_PERMISSIONS}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle1">Desing Document Module</Typography>
            <RHFMultiCheckbox
              name="services"
              options={DESIGN_DOCUMENT_MODULE_PERMISSIONS}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            />
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'fex' }}>
        {/* <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        /> */}

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentTour ? 'Create Tour' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

TourNewEditForm.propTypes = {
  currentTour: PropTypes.object,
};
