"""create_lembretes_table

Revision ID: 60807b61af86
Revises: 8c5193b27d16
Create Date: 2026-02-12 09:06:18.640618

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '60807b61af86'
down_revision: Union[str, Sequence[str], None] = '8c5193b27d16'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('lembretes',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('paciente_id', sa.Integer(), nullable=False),
    sa.Column('titulo', sa.String(), nullable=False),
    sa.Column('tipo', sa.String(), nullable=False),
    sa.Column('hora', sa.Integer(), nullable=False),
    sa.Column('minuto', sa.Integer(), nullable=False),
    sa.Column('ativo', sa.Boolean(), nullable=False),
    sa.Column('dosagem', sa.String(), nullable=True),
    sa.Column('intervalo', sa.Integer(), nullable=True),
    sa.Column('data_exame', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['paciente_id'], ['pacientes.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('lembretes')
