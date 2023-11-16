import { type PrismaClient } from '@prisma/client';
import { type seed as seedProductFields } from './productFields'

export async function seed(prisma: PrismaClient, productFields: Awaited<ReturnType<typeof seedProductFields>>) {
  const productProps = [
    {
      name: '訂製蛋糕專區',
      url: 'https://lh7-us.googleusercontent.com/CrE76uR7MHQh37mlZw1KBzzr4oE4H-GQVlfQXlCcHQHNrxFqiMZ5DBRPIXA6Na4WNkZaqfIK_PtdcSZwGUPwue7LGE9GiEC6UIZqEVeHYkaaKKWODdNy2utx7xeE4RlzpaFsdNMqKRngMrumfR4FE8gY1ELRUA',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '素/生酮流心蛋糕^如有任何食物敏感,建議向店員查詢',
      url: 'https://lh7-us.googleusercontent.com/g6s8wPMEqMX_4Gnchcsp-qB9WDazFELL04nedvXMM3kK7SAo36YtrPpYYKJ_nesel7nd1l6BwUVF-gru55BJD87AXd6BN0xBaQZWAQac8_bXKSssuQ9LKgi9Q8JZgmX1goh_L2B318QktS6jBuknKUhzZ1DZzA',
      fields: productFields.section2.concat(productFields.common),
    },
    {
      name: '雲石流心系列(不含Toppings)',
      url: 'https://lh7-us.googleusercontent.com/LzjyZHFD_YBWvnijuiCCUP_-IQkahzH17w9_taTUiN5rs-7beD4A9qLvmaYXTalCTPi1IA1Wec6g7a2ZHk6Nihq2pTrsbnaiirE40dNSxtN8HB4Y7Us2anBMHQgfQd8rTZ9wp2Vg2GR8JaLCkIkb_Njl-jSYtA',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '海鹽流心系列(不含Toppings)',
      url: 'https://lh7-us.googleusercontent.com/9zsu7leAjhrPsIzNLfdfUO5uOwJxO86GH-gqmYPy8ppLZp37v7zB-rsyyMBh_eQwpcLh71518rW3B3VDh_FpwLBJlva8wVEU4YP3hMsnJXCLri0_-3ELg-zPLGqyc1q5e4ls-RL1uo54YRgUXLg0ObZByCDeTw',
      fields: productFields.section5.concat(productFields.common),
    },
    {
      name: '數字/字母/中文字蛋糕系列',
      url: 'https://lh7-us.googleusercontent.com/Hutj9Icn3GogJj60mFywIirrq59LfJXN9PVNxXAnfsSKW27tLR168ku5yoJuLWFa30K1ZVLGwlFabjP97qUo-enj7tFmUfaXe-8C5DaMLoEWrb_s81KJD9jpKvJi4ZIPLMQdCmOY46XabIdp6USywmimM4BB1g',
      fields: productFields.section6.concat(productFields.common),
    },
    {
      name: '雪崩流心系列(不含Toppings)',
      url: 'https://lh7-us.googleusercontent.com/G2HD_XI0oe1GXBTLbbnsMY4lK_dEQyeaVVbUA0km9D8kwQyEWsunDEjspz9zEzpmjP058liRUrtpvCft68OmTj0EIe_d2rkYyiBfYsKBNF4riRvXimvNDId610Kq-EVW_IUMTjslsNwNKrccxBO7GjozzfwuVQ',
      fields: productFields.section7.concat(productFields.common),
    },
    {
      name: '散水餅系列',
      url: 'https://lh7-us.googleusercontent.com/8dOMYnTSin8z-ZbGr7Ipsk82m0wBtXeeaKt64sEJCKXzh0veVZt1fRZHFUxrr2bygU8X7Sxbmkhd2otvXV06s2CX7VU98ZU4eFQA6uN6nor59xVtOCKAznmF_OvWDdVmfhLKRO_L8YPOuhCcwcy0Gmu-dD5xHA',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '仿花束/閃石仿花流心系列(包含仿花束) (其他Toppings另計)',
      url: 'https://lh7-us.googleusercontent.com/6E5SU47tNrWz24fyXzqZNXTl0T7uKMGdjiDAZ-gs65LWJ0gjJ-CmBuu5VbWDl4sN_PNn945JZO02LwW0GM5EGsTXwv_XQTjAriBM_NtmPc91A-b9B7dNnXimUSVbQ2eOvDeBSXtrDSKtTlSNtT3XsqOH_aRDDw',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '閃閃燈水晶球雲石流心系列',
      url: 'https://lh7-us.googleusercontent.com/sCwTQYDUz4-D9ZLRmZUjis__aaObRBqcHp61lpGOprHmSaBUd9YaTmO793aO_CkKUbN5j5cTOb9ivb4eZkt40jYQr5w41tN2Y1sPyQ8tDH9wy5G6htW8Gz7izH4SU0i96SWHJLZyRcmOiWHym9kZTq97dflALg',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '雲石草莓夾心塔系列',
      url: 'https://lh7-us.googleusercontent.com/LuL46oCRAkNGqJJb3HtZ1FmAU-uF6I9I_YVriQN6bG1Eq9MZzV6sO82dedAA7JXVpgqgFi6Ptc9nUy_yxZ40Q6_CdPjnIqwcL5ogsLErw6Dn9uqnEtXHQRGx2Yj7h_0o0D0N8x3MkFsD-DMBlLCA1v_dn57DlQ',
      fields: productFields.section8.concat(productFields.common),
    },
    {
      name: '發達流心系列',
      url: 'https://lh7-us.googleusercontent.com/0aWoikz5jhSqFXsm4-M_m6u-PM_niXckNhfHxhjlDDxz5lCYxgD_mPjggbyMelh1hu-v30p0Eo4i_HT5Fd7aK2tvrzj9F0jCcfVwwK4z2sUti_x4EV1cs9xTjkcVkhFLvvuICQDMXjuC1k1LEGxhrTofxSzDKg',
      fields: productFields.section3.concat(productFields.common),
    },
    {
      name: '懸浮流心系列',
      url: 'https://lh7-us.googleusercontent.com/BtCEfdR3aDbIXYRHbn-XesJ__E3k2SQ2OqxTcD-QREIHtHGJiaKR2Eh3nhgdwP825Op1VkNEO5MDoBxEOqhk0RbJIQEK3D63hOjA7JyZwGuPi4YmIViZzYzS2QB1E91YzkY_k2Hcf4GdqlfPEbjTScjNEVSRWw',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '飲得蛋糕夾心系列',
      url: 'https://lh7-us.googleusercontent.com/MmjC99i_KnNlPnN6OFzzXI1Klvv4VQ515EH5mo5TGaJsQdzCExa2ZIssDtDl1QsKE3_-jcAsnqOTChupzrJ_OU7GKxqk2ElupQqnIjmqqLQIgbgMbyT6rWxD7yHECHgnavHnfNow9AJjlwccT06oczR2GlL-0A',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '經文流心系列 (其他Toppings另計)',
      url: 'https://lh7-us.googleusercontent.com/sKZ-SWceSUqIO-5fgtAaUJgoiPmB4o3W2Ib7eVeLK8D6LYdX2G6qkR9iDsDriH4XhE2P5z_g8jNgEVqk-Pr6vScPWde9ZNd-ohOVE4fYrrdRkCz-2iB6JeUz0Z-_dXvBQ74cGAqKtD9WRQZEHQcQcb_ekZfT9A',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '小朋友百日宴/baby smash蛋糕系列',
      url: 'https://lh7-us.googleusercontent.com/sL19wggfdRj4c8Xadopq9E1XI2dmN2lCd-V1Yd-enJrIoe6Ivf2o3o54DQfoxSL2ooa2tkJFzcBYgpRkdZftq5jaH_xn0GTTYQmGkFFEw-JQ9KgcRiGLjzE9RkoFXw3AwHDvk5JZGWeK4NuxfS-xuAye8L-sPQ',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '訂製雙層/ 3層夾心蛋糕',
      url: 'https://lh7-us.googleusercontent.com/8Ye2Y-mz-P53gsitBuplLSQDFN9ubrVdER4wuRyxFmRNA8fgz7twFdyGCwAJGkjq5kgHfZ_KFwrcHXD_VHRt766LPhcqCkVm_0zRzxOdsJzOsQOKilVtvdy7SQrjtq-ll47egRmJDyGIAkH7DPbKoC_Mts-N2g',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '公主雪崩蛋糕',
      url: 'https://lh7-us.googleusercontent.com/NpdAn-Wd22Jg6mqTmPVZ51RfYUFm2VWzWRL4BokZ13haRF74DplI6V_-63ruJIXGUlz2h0JRmAMDu945gk8xOWAqm4t1Dv-rakQOA2RjI9d-RnFhVyRfqq_25R6dnOm2X2ePY7PA9hcmAshJO6R0FsTAnzZtSQ',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '燒味系列',
      url: 'https://lh7-us.googleusercontent.com/lBUoRaXGhVfC4g-Ql6Y2nymKxnegS6NYUGqXtPdv3V8RLd3FljkLbHfEeZRB3ZI6nQf5OLqlWeX9JzRt4MTti_EMe-y8M3TSCLICLFfmGoC9SAeP4m9Rw7nqNl375sn7bGFGeA7ditca6J1mzp2rAmugdiCL0g',
      fields: productFields.section4.concat(productFields.common),
    },
    {
      name: '雲石夾心凍餅(伯爵茶味)',
      url: 'https://lh7-us.googleusercontent.com/DxlNvpTog3Q5FJKcku0KQ9WSR63M6TKgcxdR3gYIYY_XRzMOPUXiGlm6nV8lJhoxL_BihgoXrAXhhol70CcYkqrLMSimQsi1d2EDK-AycKyRXLX5O5QPbQbndbAN9C6Zirt2PLyOMH3Zzpc22WTIlsoRPFnsgA',
      fields: productFields.section8.concat(productFields.common),
    },
  ] as const;

  for (const productProp of productProps) {
    await prisma.product.create({
      data: {
        name: { create: { text: { zh_Hant_HK: productProp.name } } },
        gallery: {
          create: [
            { provider: 'external', bucket: '', objectKey: '', mimeType: '', url: productProp.url },
          ],
        },
        fields: {
          create: productProp.fields.map((field, index) => ({
            displayOrder: index,
            field: { connect: { id: field.id } },
          })),
        },
      }
    });
  }
}