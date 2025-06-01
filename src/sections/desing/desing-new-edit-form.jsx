import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

const DESING_CATEGORY_GROUP_OPTIONS = [
  {
    classify: [
      'Arajman',
      'Hesap',
      'Diagram',
      'Elektrik',
      'Teçhiz',
      'Çelik',
      'Plan',
      'Prosedür',
      'Rapor',
    ],
  },
];

const DESING_Project_GROUP_OPTIONS = [
  {
    classify: ['NB001', 'NB002', 'NB003', 'NB004', 'NB005', 'NB006', 'NB007', 'NB008', 'NB009'],
  },
];
const DESING_State_GROUP_OPTIONS = [
  {
    classify: [
      'Class approval is Required ',
      'Flag approval is required',
      'Just Owner',
      'Approval State',
      'Not approved',
    ],
  },
];
// ----------------------------------------------------------------------
// TODO: Draft ve publish aşamaları olacak maildeki gibi istersen remarkı oluşturursun istersen oluşturmadan kaydedersin
export default function DesingNewEditForm({ currentDesing }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewDesingSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
    // not required
    taxes: Yup.number(),
    newLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    saleLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentDesing?.name || '',
      description: currentDesing?.description || '',
      subDescription: currentDesing?.subDescription || '',
      images: currentDesing?.images || [],
      //
      code: currentDesing?.code || '',
      sku: currentDesing?.sku || '',
      price: currentDesing?.price || 0,
      quantity: currentDesing?.quantity || 0,
      priceSale: currentDesing?.priceSale || 0,
      tags: currentDesing?.tags || [],
      taxes: currentDesing?.taxes || 0,
      gender: currentDesing?.gender || '',
      category: currentDesing?.category || '',
      colors: currentDesing?.colors || [],
      sizes: currentDesing?.sizes || [],
      newLabel: currentDesing?.newLabel || { enabled: false, content: '' },
      saleLabel: currentDesing?.saleLabel || { enabled: false, content: '' },
    }),
    [currentDesing]
  );

  const methods = useForm({
    resolver: yupResolver(NewDesingSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentDesing) {
      reset(defaultValues);
    }
  }, [currentDesing, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentDesing?.taxes || 0);
    }
  }, [currentDesing?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentDesing ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
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

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <>
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
                  name="category"
                  label="Project Name"
                  InputLabelProps={{ shrink: true }}
                >
                  {DESING_Project_GROUP_OPTIONS.map((category) =>
                    category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))
                  )}
                </RHFSelect>
                <RHFSelect
                  native
                  name="category"
                  label="Document Type"
                  InputLabelProps={{ shrink: true }}
                >
                  {DESING_CATEGORY_GROUP_OPTIONS.map((category) =>
                    category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))
                  )}
                </RHFSelect>

                <RHFSelect
                  native
                  name="category"
                  label="Onay Durumu"
                  InputLabelProps={{ shrink: true }}
                >
                  {DESING_State_GROUP_OPTIONS.map((category) =>
                    category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))
                  )}
                </RHFSelect>

                {/* <RHFSelect
                    native
                    name="category"
                    label="Remark Topic"
                    InputLabelProps={{ shrink: true }}
                  >
                    {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                      <optgroup key={category.group} label={category.group}>
                        {category.classify.map((classify) => (
                          <option key={classify} value={classify}>
                            {classify}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </RHFSelect> */}

                {/* <RHFSelect
                    native
                    name="category"
                    label="Remark Admin"
                    InputLabelProps={{ shrink: true }}
                  >
                    {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                      <optgroup key={category.group} label={category.group}>
                        {category.classify.map((classify) => (
                          <option key={classify} value={classify}>
                            {classify}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </RHFSelect> */}

                <RHFTextField name="name" label="Document number" />
                <RHFTextField name="name" label="Document Topic" />
                <RHFTextField name="name" label="Revision number" />

                <RHFTextField name="name" label="Note" />

                <Controller
                  name="createDate"
                  //  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Due Date"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
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

              <RHFAutocomplete
                name="tags"
                label="Tags"
                placeholder="+ Tags"
                multiple
                freeSolo
                options={_tags.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />

              <Divider sx={{ borderStyle: 'dashed' }} />
            </Stack>
          </Card>
        </Stack>
      </Grid>
      <Grid xs={12} md={6}>
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
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.info('ON UPLOAD')}
                />
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

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
              <RHFTextField name="code" label="Desing Code" />

              <RHFTextField name="sku" label="Desing SKU" />

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              />

              <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} />
            </Box>

            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Regular Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            />

            {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      <Grid md={4} />
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Grid sx={{ flexGrow: 1, pl: 12 }} />
        {
          // <FormControlLabel
          // control={
          // <Switch defaultChecked /> /* TODO: publish kaldırılacak create sağ hizalanacak  */
          // }
          // label="Publish"
          // sx={{ flexGrow: 1, pl: 12 }}
          // />
        }

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentDesing ? 'Create Desing' : 'Save Changes'}
        </LoadingButton>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentDesing ? 'Create Desing' : 'Save Changes'}
        </LoadingButton>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentDesing ? 'Create Desing' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {/* renderProperties */}

        {/* renderPricing */}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

DesingNewEditForm.propTypes = {
  currentDesing: PropTypes.object,
};
