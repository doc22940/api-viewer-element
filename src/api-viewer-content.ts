import {
  LitElement,
  html,
  customElement,
  css,
  property,
  PropertyValues
} from 'lit-element';
import { TemplateResult } from 'lit-html';
import {
  PropertyInfo,
  SlotInfo,
  AttributeInfo,
  EventInfo
} from './lib/types.js';
import {
  EMPTY_ATTR_INFO,
  EMPTY_EVT_INFO,
  EMPTY_PROP_INFO,
  EMPTY_SLOT_INFO
} from './lib/constants.js';

import './api-viewer-item.js';
import './api-viewer-panel.js';
import './api-viewer-tab.js';

/* eslint-disable import/no-duplicates */
import './api-viewer-tabs.js';
import { ApiViewerTabs } from './api-viewer-tabs.js';
/* eslint-enable import/no-duplicates */

const processAttrs = (
  attrs: AttributeInfo[],
  props: PropertyInfo[]
): AttributeInfo[] => {
  return attrs.filter(attr => !props.some(prop => prop.name === attr.name));
};

const processProps = (
  props: PropertyInfo[],
  attrs: AttributeInfo[]
): PropertyInfo[] => {
  return props.map((prop: PropertyInfo) => {
    const p = prop;
    const a = attrs.find(attr => prop.name === attr.name);
    if (a) {
      p.attribute = a.name;
    }
    return p;
  });
};

@customElement('api-viewer-content')
export class ApiViewerContent extends LitElement {
  @property({ type: String }) name = '';

  @property({ attribute: false, hasChanged: () => true })
  props: PropertyInfo[] = EMPTY_PROP_INFO;

  @property({ attribute: false, hasChanged: () => true })
  attrs: AttributeInfo[] = EMPTY_ATTR_INFO;

  @property({ attribute: false, hasChanged: () => true })
  slots: SlotInfo[] = EMPTY_SLOT_INFO;

  @property({ attribute: false, hasChanged: () => true })
  events: EventInfo[] = EMPTY_EVT_INFO;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      api-viewer-item:not(:first-of-type) {
        border-top: solid 1px var(--ave-border-color);
      }
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderProperties(props: PropertyInfo[]): TemplateResult {
    const hidden = props.length === 0;
    return html`
      <api-viewer-tab
        heading="Properties"
        slot="tab"
        ?hidden="${hidden}"
      ></api-viewer-tab>
      <api-viewer-panel slot="panel" ?hidden="${hidden}">
        ${props.map(
          prop => html`
            <api-viewer-item
              .name="${prop.name}"
              .description="${prop.description}"
              .valueType="${prop.type}"
              .attribute="${prop.attribute}"
            ></api-viewer-item>
          `
        )}
      </api-viewer-panel>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderAttributes(attrs: AttributeInfo[]): TemplateResult {
    const hidden = attrs.length === 0;
    return html`
      <api-viewer-tab
        heading="Attributes"
        slot="tab"
        ?hidden="${hidden}"
      ></api-viewer-tab>
      <api-viewer-panel slot="panel" ?hidden="${hidden}">
        ${attrs.map(
          attr => html`
            <api-viewer-item
              .name="${attr.name}"
              .description="${attr.description}"
              .valueType="${attr.type}"
            ></api-viewer-item>
          `
        )}
      </api-viewer-panel>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderSlots(slots: EventInfo[]): TemplateResult {
    const hidden = slots.length === 0;
    return html`
      <api-viewer-tab
        heading="Slots"
        slot="tab"
        ?hidden="${hidden}"
      ></api-viewer-tab>
      <api-viewer-panel slot="panel" ?hidden="${hidden}">
        ${slots.map(
          slot => html`
            <api-viewer-item
              .name="${slot.name}"
              .description="${slot.description}"
            ></api-viewer-item>
          `
        )}
      </api-viewer-panel>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderEvents(events: EventInfo[]): TemplateResult {
    const hidden = events.length === 0;
    return html`
      <api-viewer-tab
        heading="Events"
        slot="tab"
        ?hidden="${hidden}"
      ></api-viewer-tab>
      <api-viewer-panel slot="panel" ?hidden="${hidden}">
        ${events.map(
          event => html`
            <api-viewer-item
              .name="${event.name}"
              .description="${event.description}"
            ></api-viewer-item>
          `
        )}
      </api-viewer-panel>
    `;
  }

  render() {
    const { slots, props, attrs, events } = this;

    const attributes = processAttrs(attrs || [], props || []);
    const properties = processProps(props || [], attrs || []);

    return html`
      <api-viewer-tabs>
        ${this.renderProperties(properties)}${this.renderAttributes(attributes)}
        ${this.renderSlots(slots)}${this.renderEvents(events)}
      </api-viewer-tabs>
    `;
  }

  updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('name') && props.get('name')) {
      const tabs = this.renderRoot.querySelector(
        'api-viewer-tabs'
      ) as ApiViewerTabs;
      tabs.selectFirst();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'api-viewer-content': ApiViewerContent;
  }
}