import React from 'react'
import { Card, Classes } from '@blueprintjs/core'
import { DeltaDialogBase, DeltaDialogHeader } from './DeltaDialog'
import { useChatListIds, useLazyChatListItems } from '../chat/ChatListHelpers'
import ChatListItem from '../chat/ChatListItem'
import { CreateChatSearchInput } from './CreateChat-Styles'
import { PseudoListItemNoSearchResults } from '../helpers/PseudoListItem'
import classNames from 'classnames'
import { callDcMethod } from '../../ipc'

const C = require('deltachat-node/constants')

export default function ForwardMessage (props) {
  const tx = window.translate
  const { forwardMessage, onClose } = props
  const { chatListIds, queryStr, setQueryStr } = useChatListIds(C.DC_GCL_NO_SPECIALS)
  const { chatItems, onChatListScroll, scrollRef } = useLazyChatListItems(chatListIds)

  const onChatClick = chatid => {
    callDcMethod('messageList.forwardMessage', [props.forwardMessage.msg.id, chatid])
    props.onClose()
  }
  const onSearchChange = e => setQueryStr(e.target.value)

  var isOpen = !!forwardMessage
  return (
    <DeltaDialogBase
      isOpen={isOpen}
      title={tx('menu_forward')}
      onClose={onClose}
      fixed
    >
      <DeltaDialogHeader onClose={onClose}>
        <CreateChatSearchInput onChange={onSearchChange} value={queryStr} placeholder={tx('contacts_enter_name_or_email')} autoFocus />
      </DeltaDialogHeader>
      <div ref={scrollRef} className={classNames(Classes.DIALOG_BODY, '.bp3-dialog-body-no-footer')} onScroll={onChatListScroll}>
        <Card style={{ padding: '0px' }}>
          <div className='forward-message-list-chat-list'>
            {chatListIds.map(chatId => <ChatListItem
              key={chatId}
              chatListItem={chatItems[chatId]}
              onClick={onChatClick.bind(null, chatId)}
            />)}
            {chatListIds.length === 0 && queryStr !== '' && PseudoListItemNoSearchResults({ queryStr })}
          </div>
        </Card>
      </div>
    </DeltaDialogBase>
  )
}
