import React from 'react'
import { Form, FormInstance, Input, TimePicker } from 'antd';
import MultipleInput from 'components/MultipleInput';
import { useTranslation } from 'react-i18next';

const ParaFormUI = ({id,form,}: {id: number | undefined;form: FormInstance;}) => {
  const {t, i18n} = useTranslation()
  const format = 'HH:mm';
  return (
    <>
    {!id ? (
        <MultipleInput isDescription={false} layout="vertical" />
      ): <div>
          <Form.Item
            label={`${t("Name")} (${i18n.language})`}
            name="name"
            rules={[{ required: true, message: `${t("Please input name")}!` }]}
          >
            <Input placeholder={`${t("Name")}`} />
          </Form.Item>
      </div>
    }
    <Form.Item
      label={t('Start time')}
      name="start_time"
      rules={[{ required: true, message: `${t('Please select start time')}!` }]}
      >
      <TimePicker placeholder={`${t("select start time")}`}  format={format} className='w-full'/>
    </Form.Item>
    <Form.Item
      label={t('End time')}
      name="end_time"
      rules={[{ required: true, message: `${t('Please select end time')}!` }]}
      >
      <TimePicker placeholder={`${t("select end time")}`}  format={format} className='w-full'/>
    </Form.Item>
    </>
  )
}

export default ParaFormUI